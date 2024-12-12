import mysql from "mysql2/promise";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


//Subir canciones
export async function POST(req) {
  try {
    // Obtener los datos de la solicitud
    const { title, artist, status, userId, categoryId } = await req.json();
    console.log("Datos recibidos:", { title, artist, status, userId, categoryId });

    if (!title || !artist || !status) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son obligatorios." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (typeof userId !== 'number') {
      return new Response(
        JSON.stringify({ error: "El campo userId debe ser un número." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (typeof categoryId !== 'number') {
      return new Response(
        JSON.stringify({ error: "El campo categoryId debe ser un número." }),
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
      "SELECT * FROM Songs WHERE title = ?",
      [title]
    );
    console.log("Canción existente:", existingSong);

    if (existingSong.length > 0) {
      await connection.end();
      return new Response(
        JSON.stringify({ message: "La canción ya existe." }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // Crear la canción
    const newSong = await prisma.songs.create({
      data: {
        title,
        artist,
        status,
        userId,
        categoryId, // Usar el ID de la categoría
      },
    });
    console.log("Canción creada:", newSong);

    return new Response(
      JSON.stringify({ message: "Canción subida con éxito", song: newSong }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error en el endpoint /api/Songs:", error.message);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

//función read para las canciones
export async function GET(req){
  try{
    //conexión a la bd
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    })

    //consultar canciones
    const [songs]= await connection.execute("SELECT * FROM Songs");
    await connection.end();
    
    if(songs.length===0){
      return new Response(
        JSON.stringify({ error: "No hay canciones aún!" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = {
      Canciones:songs[0],
    }
    
    return new Response(JSON.stringify(response), {
      status:200,
      headers: { "Content-Type": "application/json" },
    });
  }catch(error){
    console.error("Error al obtener canciones", error);
    return new Response("Error interno del servidor", { status: 500 });
  }

}