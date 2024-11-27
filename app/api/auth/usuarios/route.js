import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

function validatePassword(password) {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!password || !strongPasswordRegex.test(password)) {
    return "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.";
  }
  return null;
}

function createErrorResponse(message, status = 400) {
  return new Response(
    JSON.stringify({ message:"Verifica que las contraseñas son iguales" }),
    { status, headers: { "Content-Type": "application/json" } }
  );
}



//Crear (CREATE)
export async function POST(req) {
  try {
    const { name, lastname, usuario, password } = await req.json();

    // Validaciones
    if (!name || !lastname || !usuario || !password) {
      return createErrorResponse("Todos los campos son requeridos");
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return createErrorResponse(passwordError);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear conexión y guardar datos
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    await connection.execute(
      "INSERT INTO users (name, lastname, usuario, password) VALUES (?, ?, ?, ?)",
      [name, lastname, usuario, hashedPassword]
    );

    await connection.end();

    return new Response(
      JSON.stringify({ message: "Usuario creado exitosamente" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return createErrorResponse("Error interno del servidor", 500);
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
    const { name, lastname, password } = await req.json();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return createErrorResponse("El ID es requerido");
    }

    if (!name && !lastname && !password) {
      return createErrorResponse("Debe proporcionar al menos un campo para actualizar");
    }

    let updates = [];
    let values = [];

    if (name) {
      updates.push("name = ?");
      values.push(name);
    }
    if (lastname) {
      updates.push("lastname = ?");
      values.push(lastname);
    }
    if (password) {
      const passwordError = validatePassword(password);
      if (passwordError) {
        return createErrorResponse(passwordError);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push("password = ?");
      values.push(hashedPassword);
    }

    values.push(id);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    // Verificar si el usuario existe
    const [existingUser] = await connection.execute(
      "SELECT id FROM users WHERE id = ?",
      [id]
    );

    if (existingUser.length === 0) {
      await connection.end();
      return createErrorResponse("Usuario no encontrado", 404);
    }

    // Actualizar usuario
    await connection.execute(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    await connection.end();

    return new Response(
      JSON.stringify({ message: "Usuario actualizado exitosamente" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return createErrorResponse("Error interno del servidor", 500);
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
