import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

//Crear (CREATE)
export async function POST(req){
  try {
    const { id, name, lastname, usuario, password, confirmPassword } = await req.json();

    // Validaciones
    if (!name || !lastname || !usuario || !password) {
      return new Response(
        JSON.stringify({ message: "Todos los campos son requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return new Response(
        JSON.stringify({
          message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Crear conexión
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    // Crear usuarios
    await connection.execute(
      "INSERT INTO users (name, lastname, usuario, password) VALUES (?, ?, ?, ?)",
      [name, lastname, usuario, hashedPassword]
    );

    await connection.end();

    return new Response(
      JSON.stringify({ message: "Usuario creado exitosamente" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return new Response(
      JSON.stringify({ message: "Error interno del servidor", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

//Leer (READ)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // Obtener el ID desde los parámetros de la URL

    if (!id) {
      return new Response(
        JSON.stringify({ message: "El ID es requerido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Crear conexión
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    // Consultar usuario
    const [user] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    await connection.end();

    if (user.length === 0) {
      return new Response(
        JSON.stringify({ message: "Usuario no encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(user[0]), // Retornar el usuario encontrado
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return new Response(
      JSON.stringify({ message: "Error interno del servidor", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

//Actualizar (UPDATE)
export async function PUT(req) {
  try {
    const { id, name, lastname, password, confirmPassword } = await req.json();

    // Validaciones
    if (!id || !name || !lastname || !password || !confirmPassword) {
      return new Response(
        JSON.stringify({ message: "Todos los campos son requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (password !== confirmPassword) {
      return new Response(
        JSON.stringify({ message: "Las contraseñas no coinciden" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return new Response(
        JSON.stringify({
          message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Crear conexión
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    // Verificar si el usuario existe
    const [existingUser] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (existingUser.length === 0) {
      await connection.end();
      return new Response(
        JSON.stringify({ message: "Usuario no encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    // Crear usuarios
    await connection.execute(
      "INSERT INTO users (name, lastname, usuario, password) VALUES (?, ?, ?, ?)",
      [name, lastname, usuario, hashedPassword]
    );

    // Actualizar el usuario
    await connection.execute(
      "UPDATE users SET name = ?, lastname = ?, password = ? WHERE id = ?",
      [name, lastname, hashedPassword, id]
    );

    await connection.end();

    return new Response(
      JSON.stringify({ message: "Usuario actualizado exitosamente" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return new Response(
      JSON.stringify({ message: "Error interno del servidor", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

//Borrar (DELETE)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // Obtener el ID desde los parámetros de la URL

    if (!id) {
      return new Response(
        JSON.stringify({ message: "El ID es requerido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Crear conexión
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    // Eliminar usuario
    const [result] = await connection.execute(
      "DELETE FROM users WHERE id = ?",
      [id]
    );

    await connection.end();

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ message: "Usuario no encontrado o ya eliminado" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Usuario eliminado exitosamente" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return new Response(
      JSON.stringify({ message: "Error interno del servidor", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
