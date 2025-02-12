import mysql from "mysql2/promise";

export async function GET(req) {
  const { search } = Object.fromEntries(new URL(req.url).searchParams);

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    if (!search) {
      return new Response(
        JSON.stringify({ error: "Debe proporcionar un término de búsqueda." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      // Búsqueda de usuarios solo por nombre de usuario con información completa
      const [users] = await connection.execute(
        `SELECT id, name, lastname, username, roleId, avatar, created_at 
         FROM User 
         WHERE username LIKE ?`,
        [`%${search}%`]
      );

      // Definir la URL base para archivos dinámicos
      const baseFileUrl = "/api/uploads";

      // Formatear usuarios, transformando el avatar si corresponde
      const usersWithSongs = await Promise.all(
        users.map(async (user) => {
          // Si el avatar comienza con "/uploads", se transforma la URL;
          // en caso contrario, se deja como está (por ejemplo, si es el default y está en public)
          const formattedAvatar =
            user.avatar && user.avatar.startsWith("/uploads")
              ? `${baseFileUrl}${user.avatar.replace(/^\/uploads/, "")}`
              : user.avatar;

          // Consultar las canciones del usuario
          const [songs] = await connection.execute(
            `SELECT 
              Songs.id AS songId,
              Songs.title,
              Songs.validate,
              Songs.createdAt,
              Songs.categoryId,
              categories.name AS categoryName,
              Image.fileName AS imageFileName,
              Music.fileName AS musicFileName
            FROM Songs
            LEFT JOIN categories ON Songs.categoryId = categories.id
            LEFT JOIN Image ON Songs.id = Image.songId
            LEFT JOIN Music ON Songs.id = Music.songId
            WHERE Songs.userId = ?`,
            [user.id]
          );

          // Formatear las rutas de imagen y música de las canciones
          const formattedSongs = songs.map((song) => ({
            songId: song.songId,
            title: song.title,
            validate: song.validate,
            createdAt: song.createdAt,
            categoryId: song.categoryId,
            categoryName: song.categoryName || null,
            image:
              song.imageFileName && song.imageFileName.startsWith("/uploads")
                ? `${baseFileUrl}${song.imageFileName.replace(
                    /^\/uploads/,
                    ""
                  )}`
                : song.imageFileName,
            music:
              song.musicFileName && song.musicFileName.startsWith("/uploads")
                ? `${baseFileUrl}${song.musicFileName.replace(
                    /^\/uploads/,
                    ""
                  )}`
                : song.musicFileName,
          }));

          return { ...user, avatar: formattedAvatar, songs: formattedSongs };
        })
      );

      // Búsqueda de canciones solo por título con información completa
      const [songs] = await connection.execute(
        `SELECT 
          s.id, 
          s.title, 
          s.userId,
          u.username AS username, 
          s.categoryId, 
          c.name AS categoryName, 
          s.validate, 
          s.createdAt,
          i.fileName AS imageFileName,
          m.fileName AS musicFileName
        FROM Songs s
        LEFT JOIN categories c ON s.categoryId = c.id
        LEFT JOIN Image i ON s.id = i.songId
        LEFT JOIN Music m ON s.id = m.songId
        LEFT JOIN User u ON s.userId = u.id
        WHERE s.title LIKE ?`,
        [`%${search}%`]
      );

      const formattedSongs = songs.map((song) => ({
        id: song.id,
        title: song.title,
        userId: song.userId,
        username: song.username,
        categoryId: song.categoryId,
        categoryName: song.categoryName,
        validate: song.validate,
        createdAt: song.createdAt,
        image:
          song.imageFileName && song.imageFileName.startsWith("/uploads")
            ? `${baseFileUrl}${song.imageFileName.replace(/^\/uploads/, "")}`
            : song.imageFileName,
        music:
          song.musicFileName && song.musicFileName.startsWith("/uploads")
            ? `${baseFileUrl}${song.musicFileName.replace(/^\/uploads/, "")}`
            : song.musicFileName,
      }));

      let message;
      if (usersWithSongs.length === 0 && formattedSongs.length === 0) {
        message = "No se encontraron resultados.";
      }

      return new Response(
        JSON.stringify({
          users: usersWithSongs,
          songs: formattedSongs,
          message,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error("Error interno del servidor:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

