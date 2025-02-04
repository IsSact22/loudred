import { Pool } from "pg";

// Configurar pool de conexiones global
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

// Actualizar el campo `validate` de una canción
export async function PUT(req, { params }) {
  const { id } = params; // Corrección: no necesitas `await`
  const { validate } = await req.json();

  if (typeof validate !== "boolean") {
    return new Response(JSON.stringify({ message: "El valor debe ser booleano" }), {
      status: 400,
    });
  }

  try {
    const { rowCount } = await pool.query(
      "UPDATE songs SET validate = $1 WHERE id = $2 RETURNING *",
      [validate, id]
    );

    if (rowCount === 0) {
      return new Response(
        JSON.stringify({ error: "No existe canción por actualizar!" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Canción actualizada exitosamente" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar la canción:", error);
    return new Response("Error interno del servidor", { status: 500 });
  }
}

// Eliminar una canción
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const { rowCount } = await pool.query("DELETE FROM songs WHERE id = $1", [id]);

    if (rowCount === 0) {
      return new Response("Canción no encontrada", { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Canción eliminada exitosamente" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error al eliminar la canción:", error);
    return new Response("Error interno del servidor", { status: 500 });
  }
}

// Obtener una sola canción con detalles
export async function GET(req, { params }) {
  const { id } = params;

  if (!id || isNaN(Number(id))) {
    return new Response(JSON.stringify({ error: "El ID de la canción no es válido" }), {
      status: 400,
    });
  }

  try {
    const { rows } = await pool.query(
      `SELECT 
        s.id, 
        s.title, 
        s.userId, 
        s.categoryId, 
        c.name AS categoryName, 
        s.validate, 
        s.createdAt,
        i.fileName AS imageFileName,
        m.fileName AS musicFileName
      FROM songs s
      LEFT JOIN categories c ON s.categoryId = c.id
      LEFT JOIN images i ON s.id = i.songId
      LEFT JOIN music m ON s.id = m.songId
      WHERE s.id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "La canción no existe" }), {
        status: 404,
      });
    }

    const song = rows[0];

    return new Response(
      JSON.stringify({
        id: song.id,
        title: song.title,
        userId: song.userId,
        categoryId: song.categoryId,
        categoryName: song.categoryName || null,
        validate: song.validate,
        createdAt: song.createdAt,
        image: song.imageFileName || null,
        music: song.musicFileName || null,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener la canción específica:", error);
    return new Response("Error interno del servidor", { status: 500 });
  }
}
