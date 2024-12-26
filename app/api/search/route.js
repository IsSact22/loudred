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
      // Búsqueda de usuarios
      const [users] = await connection.execute(
        `SELECT id AS userId, name, lastname, username 
         FROM User 
         WHERE username LIKE ?`,
        [`%${search}%`]
      );

      // Búsqueda de canciones
      const [songs] = await connection.execute(
        `SELECT Songs.id AS songId, Songs.title AS songTitle, User.username 
         FROM Songs 
         LEFT JOIN User ON Songs.userId = User.id
         WHERE Songs.title LIKE ?`,
        [`%${search}%`]
      );

      // Generar mensajes en caso de que no se encuentren resultados
      let message;
      if (users.length === 0 && songs.length === 0) {
        message = "No se encontraron resultados.";
      }

      // Respuesta con ambos resultados
      return new Response(
        JSON.stringify({ users, songs, message }),
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
