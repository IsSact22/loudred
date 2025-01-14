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
    const validateRaw = data.get("validate"); // Obtén validate como string
    const validate = validateRaw === "true";
    const userId = parseInt(data.get("userId"));
    const categoryId = parseInt(data.get("categoryId"));

    console.log("Datos recibidos:", { title, validate, userId, categoryId });

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
      return createErrorResponse(errorMessage);

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
      const musicUploadPath = path.join(process.cwd(), "public/uploads/music", newMusicFilename);

      const audioBytes = await music.arrayBuffer();
      const audioBuffer = Buffer.from(audioBytes);

      try {
        await writeFile(musicUploadPath, audioBuffer);
        musicPath = `/uploads/music/${newMusicFilename}`;
        console.log("Canción guardada:", newMusicFilename);
      } catch (error) {
        console.error("Error al guardar la canción:", error);
        return new Response(
          JSON.stringify({ success: false, message: "Error al guardar la canción" }),
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

export async function GET(req) {
  try {
    // Conexión a la base de datos MySQL
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    // Consulta para obtener canciones con sus imágenes y música
    const [songs] = await connection.execute(`
      SELECT 
        Songs.id AS songId,
        Songs.title,
        Songs.validate,
        Songs.createdAt,
        Songs.userId,
        Songs.categoryId,
        categories.name AS categoryName, -- Agregamos el nombre de la categoría
        Image.fileName AS imageFileName,
        Music.fileName AS musicFileName
      FROM Songs
      LEFT JOIN categories ON Songs.categoryId = categories.id -- Unión con la tabla categories
      LEFT JOIN Image ON Songs.id = Image.songId -- Unión con la tabla Image
      LEFT JOIN Music ON Songs.id = Music.songId -- Unión con la tabla Music
    `);
    
    await connection.end();

    if (songs.length === 0) {
      return new Response(
        JSON.stringify({ error: "No hay canciones aún!" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Agrupar resultados por canción
    const groupedSongs = songs.reduce((acc, song) => {
      const existingSong = acc.find((s) => s.songId === song.songId);

      if (existingSong) {
        // Si ya existe la canción en el grupo, agrega imagen/música adicional
        if (song.imageFileName) existingSong.images.push(song.imageFileName);
        if (song.musicFileName) existingSong.music.push(song.musicFileName);
      } else {
        // Si es una nueva canción, crea un nuevo objeto
        acc.push({
          songId: song.songId,
          title: song.title,
          validate: song.validate,
          createdAt: song.createdAt,
          userId: song.userId,
          categoryId: song.categoryId,
          categoryName: song.categoryName || null,
          images: song.imageFileName ? [song.imageFileName] : [],
          music: song.musicFileName ? [song.musicFileName] : [],
        });
      }

      return acc;
    }, []);

    return new Response(JSON.stringify({ songs: groupedSongs }), {
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
