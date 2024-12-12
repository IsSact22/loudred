import mysql from "mysql2/promise";

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