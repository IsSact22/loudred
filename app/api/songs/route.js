import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
// import { v4 as uuidv4 } from "uuid";
// import { writeFile } from "fs/promises";
// import path from "path";
// import { dir } from "console";
// import { buffer } from "stream/consumers";

const prisma = new PrismaClient();
// Configurar pool de conexiones global
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});
// Subir canciones, imágenes y audios (música)
export async function POST(req) {
  try {
    // Leer los datos del formulario multipart
    const data = await req.formData(); // Usamos formData() para manejar archivos
    const image = data.get("image");
    const music = data.get("music");

    // Obtener los otros datos del formulario
    const title = data.get("title");
    const validateRaw = data.get("validate"); // Obtén validate como string
    const validate = validateRaw === "true";
    const userId = parseInt(data.get("userId"));
    const categoryId = parseInt(data.get("categoryId"));

    // Validación
    const missingFields=[];
    if(!title) missingFields.push("Titulo");
    if(!userId) missingFields.push("UserId");
    if(!categoryId) missingFields.push("Categoria");
    
    if (missingFields.length>0){
      const errorMessage=
        missingFields.length===5
          ? "Todos los campos son requeridos"
          : `Los siguientes campos son requeridos: ${missingFields.join(", ")}`;
      return new Response(errorMessage);

    }

    // Validar si se han enviado los archivos de imagen y música
    if (!image || image.size === 0 || !music || music.size === 0) {
      return new Response(
        JSON.stringify({ error: "Se requieren los archivos de imagen y música." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

  
    // Validar canción duplicada
    const {rows:existingSong} = await pool.query(
      `SELECT * FROM "Songs" WHERE title = $1`,
      [title]
    );

    if (existingSong.length > 0) {
      return new Response(
        JSON.stringify({ message: "La canción ya existe." }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // Crear la canción en la base de datos con Prisma
    const newSong = await prisma.songs.create({
      data: {
        title,
        validate,
        userId,  // Usar userId como número
        categoryId,  // Usar categoryId como número
      },
    });
    
    //crear directorio donde se alojará la multimedia en caso de no tenerlo
    const fs = require('fs');
    const path = require('path');
    const {v4:uuidv4} = require('uuid');
    const {writeFile} = require('fs/promises');

    const uploadsPath = path.join(process.cwd(), 'public/uploads');
    const imagesPath = path.join(uploadsPath, 'images');
    const musicsPath = path.join(uploadsPath, 'music');

    //Generar un nombre único para ambos archivos
    const uniqueFilename= uuidv4();
    // Subir imagen
    let imagePath = null;
    if(image){
      const imageExtension = image.name.split(".").pop();
      const newImageFilename = `${uniqueFilename}.${imageExtension}`;
      const imageUploadPath = path.join(imagesPath, newImageFilename);
      const imageBytes= await image.arrayBuffer();
      const imageBuffer= Buffer.from(imageBytes);
      try{
        await writeFile(imageUploadPath, imageBuffer);
        imagePath= `/uploads/images/${newImageFilename}`;
      }catch (error){
        console.error("Error al guardar la imagen: ", error)
        return new Response(
          JSON.stringify({ success: false, message: "Error al guardar la imagen" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    //subir música
    let musicPath =null;
    if(music){
      const musicExtension= music.name.split(".").pop();
      const newMusicFilename= `${uniqueFilename}.${musicExtension}`;
      const musicUploadPath= path.join(musicsPath, newMusicFilename);
      const MusicBytes= await music.arrayBuffer();
      const MusicBuffer= Buffer.from(MusicBytes);
      try{
        await writeFile(musicUploadPath, MusicBuffer);
        musicPath=`/uploads/music/${newMusicFilename}`;
      }catch (error){
        console.error("Error al guardar el audio: ", error)
        return new Response(
          JSON.stringify({ success: false, message: "Error al guardar el audio" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }




    // let imagePath = null;
    // if (image) {
    //   const newImageFilename = `${uuidv4()}.${image.name.split(".").pop()}`;
    //   const imageUploadPath = path.join(process.cwd(), "public/uploads/images", newImageFilename);

    //   const imageBytes = await image.arrayBuffer();
    //   const imageBuffer = Buffer.from(imageBytes);

    //   try {
    //     await writeFile(imageUploadPath, imageBuffer);
    //     imagePath = `/uploads/images/${newImageFilename}`;
    //   } catch (error) {
    //     console.error("Error al guardar la imagen:", error);
    //     return new Response(
    //       JSON.stringify({ success: false, message: "Error al guardar la imagen" }),
    //       { status: 500, headers: { "Content-Type": "application/json" } }
    //     );
    //   }
    // }

    // // Subir audio (ahora música) si existe
    // let musicPath = null;
    // if (music) {
    //   const newMusicFilename = `${uuidv4()}.${music.name.split(".").pop()}`;
    //   const musicUploadPath = path.join(process.cwd(), "public/uploads/music", newMusicFilename);

    //   const audioBytes = await music.arrayBuffer();
    //   const audioBuffer = Buffer.from(audioBytes);

    //   try {
    //     await writeFile(musicUploadPath, audioBuffer);
    //     musicPath = `/uploads/music/${newMusicFilename}`;
    //   } catch (error) {
    //     console.error("Error al guardar la canción:", error);
    //     return new Response(
    //       JSON.stringify({ success: false, message: "Error al guardar la canción" }),
    //       { status: 500, headers: { "Content-Type": "application/json" } }
    //     );
    //   }
    // }

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
 
    return new Response(
      JSON.stringify({ success: true, message: "Canción y archivos guardados correctamente", song: newSong, id: newSong.id }),
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
export async function GET(req) {
  try {
    

    const {rows: songs} = await pool.query(
      `SELECT 
        "Songs".id AS "songId",
        "Songs".title,
        "Songs".validate,
        "Songs"."createdAt",
        "Songs"."userId",
        "Songs"."categoryId",
        categories.name AS "categoryName",
        "Image"."fileName" AS "imageFileName",
        "Music"."fileName" AS "musicFileName",
        "User"."username" AS "username"
      FROM "Songs"
      LEFT JOIN categories ON "Songs"."categoryId" = categories.id
      LEFT JOIN "Image" ON "Songs".id = "Image"."songId"
      LEFT JOIN "Music" ON "Songs".id = "Music"."songId"
      LEFT JOIN "User" ON "Songs"."userId" = "User".id`
    );

    if (songs.length === 0) {
      return new Response(
        JSON.stringify({ error: "No hay canciones aún!" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const formattedSongs = songs.map((song) => ({
      id: song.songId,
      title: song.title,
      validate: song.validate,
      createdAt: song.createdAt,
      userId: song.userId,
      username: song.username || null,
      categoryId: song.categoryId,
      categoryName: song.categoryName || null,
      image: song.imageFileName ? `${song.imageFileName}` : null,
      music: song.musicFileName ? `${song.musicFileName}` : null,
    }));

    return new Response(JSON.stringify({ songs: formattedSongs }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener canciones", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
