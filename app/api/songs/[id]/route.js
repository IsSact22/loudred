
import mysql from "mysql2/promise";

//actualizar validate de canciones
export async function PUT(req, {params}) {
  const {id} = params;
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
        [id] // Filtrar por el ID de la canción
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
      const [validates] = await connection.execute("SELECT validate FROM songs WHERE id = ?", [id]);

      if (validates.length === 0) {
          return new Response(JSON.stringify({ message: "La canción no existe" }), { status: 404 });
      }

      // Si la canción tiene el campo `validate` como NULL, actualizar a TRUE
      updates.push("validate = ?");
      values.push(validate);

      // Ejecutar la consulta de actualización
      await connection.execute(
          `UPDATE songs SET ${updates.join(",")} WHERE id = ?`,
          [...values, id]
      );

      await connection.end();

      return new Response(
          JSON.stringify({ message: "Canción actualizada exitosamente" }),
          { status: 200 }
      );

  } catch (error) {
      console.error("Error al actualizar la canción:", error);
      return new Response("Error interno del servidor", { status: 500 });
  } finally {
      if (connection) {
          await connection.end(); // Asegurarse de cerrar la conexión al final
      }
  }
}


//borrar canciones
export async function DELETE(req, { params }) {
    const { id } = params;
  
    try {
  
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      });
  
      const [result] = await connection.execute("DELETE FROM Songs WHERE id = ?", [id]);
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
  export async function GET(req, context) {
    const { params } = await context;
    const songId = params.id;
  
    try {
      // Configuración de conexión a la base de datos
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
        WHERE s.id = ?
        `,
        [songId]
      );
  
      if (songResult.length === 0) {
        await connection.end();
        return new Response(
          JSON.stringify({ error: "La canción no existe" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
  
      const song = songResult[0];
  
      await connection.end();
  
      // Estructurar la respuesta
      const response = {
        id: song.id,
        title: song.title,
        userId: song.userId,
        categoryId: song.categoryId,
        categoryName: song.categoryName || null,
        validate: song.validate,
        createdAt: song.createdAt,        
        image: song.imageFileName ? `${song.imageFileName}` : null,
        music: song.musicFileName ? `${song.musicFileName}` : null,
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
  