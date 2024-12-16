
import mysql from "mysql2/promise";
import { boolean } from "yup";



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