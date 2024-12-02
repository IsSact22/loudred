import {verifyToken} from "@/app/api/middleware/auth";
import mysql from "mysql2/promise";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Verificar el token
    let token;

    try {
      token = await verifyToken(req);
      console.log("Token recibido:", token);
    } catch (error) {
      console.error("Error en autenticación:", error.message);
    }


    if (!token) {
      return new Response(
        JSON.stringify({ error: "No estás autenticado. Token inválido." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Si el token es válido, obtener los datos de la solicitud
    const { nombre, artista, categoria, status } = await req.json();

    // Validar que los campos necesarios estén presentes
    if (!nombre || !artista || !categoria || !status) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son obligatorios." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
// Crear conexión a la base de datos para verificar duplicados
const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Validar que la canción no esté repetida
const [existingSong] = await connection.execute(
  "SELECT * FROM canciones WHERE nombre = ?",
  [nombre]
);

if (existingSong.length > 0) {
  await connection.end(); // Cerrar conexión
  return new Response(
    JSON.stringify({ message: "La canción ya existe." }),
    { status: 409, headers: { "Content-Type": "application/json" } }
  );
}

// Cerrar conexión tras la verificación
await connection.end();

    // Crear una canción en la base de datos
    const newSong = await prisma.canciones.create({
      data: {
        nombre,
        artista,
        categoria,
        status,
        userId: token.id, // Vincular con el ID del usuario del token
      },
    });
    const responseBody = {
      message: "Canción subida con éxito",
      song: newSong,
    };

    return new Response(
      JSON.stringify(responseBody),
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
