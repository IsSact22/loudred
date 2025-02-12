
import mysql from "mysql2/promise";

//actualizar validate de canciones
// Se cambia la lectura del body de JSON a FormData para procesar el envío desde FormData

export async function POST(req, { params }) {
  // Extraer el id sin await, ya que params ya es un objeto:
  const { id: songId } = await params;

  // Obtener el FormData de la solicitud
  const formData = await req.formData();
  const validateValue = formData.get("validate");
  // Convertir el valor a booleano (si no es "true", será false)
  const validate = validateValue === "true";

  let connection;

  try {
    // Conectar a la base de datos
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    // Verificar que la canción existe
    const [song] = await connection.execute(
      "SELECT * FROM songs WHERE id = ?",
      [songId]
    );
    if (song.length === 0) {
      return new Response(
        JSON.stringify({ error: "No existe canción por actualizar!" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Actualizar la canción (solo la columna "validate")
    await connection.execute("UPDATE songs SET validate = ? WHERE id = ?", [
      validate,
      songId,
    ]);

    return new Response(
      JSON.stringify({ message: "Canción actualizada exitosamente" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error al actualizar la canción:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    if (connection) await connection.end();
  }
}

//borrar canciones
export async function DELETE(req, { params }) {
  const { id } = await params;
  const songId = id;
  
    try {
  
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      });
  
      const [result] = await connection.execute("DELETE FROM Songs WHERE id = ?", [songId]);
      await connection.end();
  
      if (result.affectedRows === 0) {
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

  //get de una sola canción
  export async function GET(req, { params }) {
    // Extraer el id sin await, ya que params ya es un objeto
    const { id } = await params;
    const songId = id;

    try {
      // Conexión a la base de datos
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      });

      // Validación del ID de la canción
      if (!songId || isNaN(Number(songId))) {
        return new Response(
          JSON.stringify({ error: "El ID de la canción no es válido" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Consultar la canción por ID con su categoría, imagen y música
      const [songResult] = await connection.execute(
        `
      SELECT 
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
      LEFT JOIN \`user\` u ON s.userId = u.id
      WHERE s.id = ?
      `,
        [songId]
      );

      if (songResult.length === 0) {
        await connection.end();
        return new Response(JSON.stringify({ error: "La canción no existe" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      const song = songResult[0];
      await connection.end();

      // Definir la URL base para servir archivos (endpoint que lee archivos dinámicos)
      const baseFileUrl = "/api/uploads";

      // Formatear la ruta de imagen y música, removiendo el prefijo "/uploads" y concatenándolo con la URL base.
      const response = {
        id: song.id,
        title: song.title,
        userId: song.userId,
        username: song.username,
        categoryId: song.categoryId,
        categoryName: song.categoryName,
        validate: song.validate,
        createdAt: song.createdAt,
        image: song.imageFileName
          ? `${baseFileUrl}${song.imageFileName.replace(/^\/uploads/, "")}`
          : null,
        music: song.musicFileName
          ? `${baseFileUrl}${song.musicFileName.replace(/^\/uploads/, "")}`
          : null,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error al obtener la canción específica:", error.message);
      return new Response(
        JSON.stringify({ error: "Error interno del servidor" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  