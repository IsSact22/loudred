import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";


// Validación de entrada
function validacionInput({ name, lastname, username, password, confirmPassword }) {
  if (!name ||!lastname || !username || !password || !confirmPassword) {
    return "Todos los campos son necesarios";
  }
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(name)) {
    return "El nombre no puede contener números ni caracteres especiales";
  }
  if (!nameRegex.test(lastname)) {
    return "El apellido no puede contener números ni caracteres especiales";
  }
  const UsuarRegex = /^[A-Z][a-z]*\d+$/;
  if (!UsuarRegex.test(username)) {
    return "El Usuario no es válido. Debe comenzar con una letra mayúscula, seguir con minúsculas y contener al menos un número.";
  }
  if (password !== confirmPassword) {
    return "Las contraseñas no coinciden";
  }
  if (!isStrongPassword(password)) {
    return "La contraseña no es fuerte. Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial.";
  }
  return null; // No hay errores
}

// Fortaleza de contraseña
function isStrongPassword(password) {
  const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]{8,}$/;
  return strongPasswordRegex.test(password);
}

// Función para manejar el registro
export async function POST(req) {
  try {
    // Parsear y validar la entrada
    const { name, lastname, username, password, confirmPassword } = await req.json();

    const validationError = validacionInput({ name, lastname, username, password, confirmPassword });
    if (validationError) {
      return new Response(
        JSON.stringify({ message: validationError }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Crear una conexión a la base de datos
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    // Verificar si el usuario ya existe
    const [existingUser] = await connection.execute(
      "SELECT * FROM User WHERE username = ?",
      [username]
    );
    if (existingUser.length > 0) {
      await connection.end(); // Cerrar conexión
      return new Response(
        JSON.stringify({ message: "El usuario ya existe" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // Obtener el roleId para el rol "USER"
    const [role] = await connection.execute(
      "SELECT id FROM role WHERE name = ?",
      ["USER"]
    );
    if (role.length === 0) {
      await connection.end(); // Cerrar conexión
      return new Response(
        JSON.stringify({ message: "El rol 'USER' no existe" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const roleId = role[0].id;

    // Crear el usuario con contraseña encriptada
    const hashedPassword = await bcrypt.hash(password, 10);
    await connection.execute(
      "INSERT INTO User (name, lastname, username, password, roleId) VALUES (?, ?, ?, ?, ?)",
      [name, lastname, username, hashedPassword, roleId]
    );

    // Cerrar la conexión
    await connection.end();

    return new Response(
      JSON.stringify({ message: "Usuario registrado exitosamente" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error interno:", error);
    return new Response(
      JSON.stringify({
        message: "Error interno del servidor",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}