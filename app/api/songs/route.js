import { PrismaClient } from "@prisma/client";
import mysql from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// Subir canciones, imágenes y audios (música)
export async function POST(req) {
  try {
    // Leer los datos del formulario multipart
    const data = await req.formData(); // Usamos formData() para manejar archivos
    const image = data.get("image");
    const music = data.get("music");

    // Obtener los otros datos del formulario
    const title = data.get("title");
    const artist = data.get("artist");
    const validateRaw = data.get("validate"); // Obtén validate como string
    const validate = validateRaw === "true";
    const userId = parseInt(data.get("userId"));
    const categoryId = parseInt(data.get("categoryId"));

    console.log("Datos recibidos:", { title, artist, validate, userId, categoryId });

    // Validación
    if (!title || !artist || !userId || !categoryId) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son obligatorios." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validar si se han enviado los archivos de imagen y música
    if (!image || image.size === 0 || !music || music.size === 0) {
      return new Response(
        JSON.stringify({ error: "Se requieren los archivos de imagen y música." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Conexión a la base de datos MySQL
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

    // Crear la canción en la base de datos con Prisma
    const newSong = await prisma.songs.create({
      data: {
        title,
        artist,
        validate,
        userId,  // Usar userId como número
        categoryId,  // Usar categoryId como número
      },
    });
    console.log("Canción creada:", newSong);

    // Subir imagen si existe
    let imagePath = null;
    if (image) {
      const newImageFilename = `${uuidv4()}.${image.name.split(".").pop()}`;
      const imageUploadPath = path.join(process.cwd(), "public/uploads/images", newImageFilename);

      const imageBytes = await image.arrayBuffer();
      const imageBuffer = Buffer.from(imageBytes);

      try {
        await writeFile(imageUploadPath, imageBuffer);
        imagePath = `/uploads/images/${newImageFilename}`;
        console.log("Imagen guardada:", newImageFilename);
      } catch (error) {
        console.error("Error al guardar la imagen:", error);
        return new Response(
          JSON.stringify({ success: false, message: "Error al guardar la imagen" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Subir audio (ahora música) si existe
    let musicPath = null;
    if (music) {
      const newMusicFilename = `${uuidv4()}.${music.name.split(".").pop()}`;
      const musicUploadPath = path.join(process.cwd(), "public/uploads/musics", newMusicFilename);

      const audioBytes = await music.arrayBuffer();
      const audioBuffer = Buffer.from(audioBytes);

      try {
        await writeFile(musicUploadPath, audioBuffer);
        musicPath = `/uploads/musics/${newMusicFilename}`;
        console.log("Música guardada:", newMusicFilename);
      } catch (error) {
        console.error("Error al guardar la música:", error);
        return new Response(
          JSON.stringify({ success: false, message: "Error al guardar la música" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Registrar los archivos de imagen y música en la base de datos, si existen
    if (imagePath) {
      await prisma.image.create({
        data: {
          fileName: imagePath,
          songId: newSong.id,
          userId,
        },
      });
    }

    if (musicPath) {
      await prisma.music.create({  // Cambié 'audio' por 'music' aquí
        data: {
          fileName: musicPath,
          songId: newSong.id,
          userId,
        },
      });
    }

    // Finalizar la conexión MySQL
    await connection.end();

    return new Response(
      JSON.stringify({ success: true, message: "Canción y archivos guardados correctamente", song: newSong }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error en el endpoint /api/songs", error.message);
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