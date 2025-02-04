import { Pool } from "pg";

// Configurar pool de conexiones global
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

export async function GET(req) {
  const { search } = Object.fromEntries(new URL(req.url).searchParams);

  if (!search) {
    return new Response(
      JSON.stringify({ error: "Debe proporcionar un término de búsqueda." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Búsqueda de usuarios
    const { rows: users } = await pool.query(
      `SELECT id AS userId, name, lastname, username 
       FROM "User" 
       WHERE username ILIKE $1`,
      [`%${search}%`]
    );

    // Búsqueda de canciones
    const { rows: songs } = await pool.query(
      `SELECT Songs.id AS songId, Songs.title AS songTitle, User.username 
       FROM Songs 
       LEFT JOIN "User" ON Songs.userId = "User".id
       WHERE Songs.title ILIKE $1`,
      [`%${search}%`]
    );

    // Generar mensaje en caso de que no se encuentren resultados
    let message = "Resultados encontrados.";
    if (users.length === 0 && songs.length === 0) {
      message = "No se encontraron resultados.";
    }

    // Respuesta con ambos resultados
    return new Response(
      JSON.stringify({ users, songs, message }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error interno del servidor:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
