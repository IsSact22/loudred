import { Pool } from "pg";

//actualizar validate de canciones
export async function PUT(req, {params}) {
  const { id } = await params;
  const songId = id;
  const {validate} = await req.json();
  let connection;

  try {
      // Validar que el valor de validate sea booleano
      if (typeof validate !== "boolean") {
          return new Response(JSON.stringify({ message: "El valor debe ser booleano" }), {
              status: 400,
          });
      }

      let updates = [];
      let values = [];

      connection = await mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
      });
        
      const [song] = await connection.execute(
        "SELECT * FROM songs WHERE id = ?",
        [songId] // Filtrar por el ID de la canción
      );
      
      // Validar que exista la canción
      if (song.length === 0) {
        return new Response(
          JSON.stringify({ error: "No existe canción por actualizar!" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
      
  
        // Validar que el valor de validate sea booleano
        if (typeof validate !== "boolean") {
            return new Response(JSON.stringify({ message: "El valor debe ser booleano" }), {
                status: 400,
            });
        }

      // Verificar si el valor 'validate' es NULL, en caso de que quieras actualizarlo solo a TRUE
      const [validates] = await connection.execute("SELECT validate FROM songs WHERE id = ?", [songId]);

      if (validates.length === 0) {
          return new Response(JSON.stringify({ message: "La canción no existe" }), { status: 404 });
      }

      // Si la canción tiene el campo `validate` como NULL, actualizar a TRUE
      updates.push("validate = ?");
      values.push(validate);

      // Ejecutar la consulta de actualización
      await connection.execute(
          `UPDATE songs SET ${updates.join(",")} WHERE id = ?`,
          [...values, songId]
      );

      await connection.end();

    return new Response(
      JSON.stringify({ message: "Canción actualizada exitosamente" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar la canción:", error);
    return new Response("Error interno del servidor", { status: 500 });
  }
}


//borrar canciones
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
