import mysql from "mysql2/promise";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Obtener los datos de la solicitud
    const { nombre, artista, categoria, status } = await req.json();
    console.log("Datos recibidos:", { nombre, artista, categoria, status });

    if (!nombre || !artista || !categoria || !status) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son obligatorios." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Conexión a la base de datos
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    // Validar canción duplicada
    const [existingSong] = await connection.execute(
      "SELECT * FROM canciones WHERE nombre = ?",
      [nombre]
    );
    console.log("Canción existente:", existingSong);

    if (existingSong.length > 0) {
      await connection.end();
      return new Response(
        JSON.stringify({ message: "La canción ya existe." }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // Buscar el id de la categoría en la base de datos
    const category = await prisma.categorias.findUnique({
      where: { id: parseInt(categoria) }, // Usar el ID numérico de la categoría
    });

    if (!category) {
      await connection.end(); // Cerrar conexión
      return new Response(
        JSON.stringify({ error: "Categoría no encontrada." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    await connection.end(); // Cerrar la conexión

    // Crear la canción
    const newSong = await prisma.canciones.create({
      data: {
        nombre,
        artista,
        status,
        userId: token.id,
        categoriaId: category.id, // Usar el ID de la categoría
      },
    });
    console.log("Canción creada:", newSong);

    return new Response(
      JSON.stringify({ message: "Canción subida con éxito", song: newSong }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error en el endpoint /api/canciones:", error.message);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
