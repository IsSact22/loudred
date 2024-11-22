import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

// Validación de entrada
function validacionInput({ name, email, password, confirmPassword }) {
  if (!name || !email || !password || !confirmPassword) {
    return "Todos los campos son necesarios";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "El email no es válido";
  }
  if (password !== confirmPassword) {
    return "Las contraseñas no coinciden";
  }
  if (!isStrongPassword(password)) {
    return "La contraseña no es fuerte. Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.";
  }
  return null; // No hay errores
}

// Fortaleza de contraseña
function isStrongPassword(password) {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return strongPasswordRegex.test(password);
}

// Función para manejar el registro
export async function POST(req) {
  try {
    // Parsear y validar la entrada
    const { name, email, password, confirmPassword } = await req.json();

    const validationError = validacionInput({ name, email, password, confirmPassword });
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
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      await connection.end(); // Cerrar conexión
      return new Response(
        JSON.stringify({ message: "El usuario ya existe" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // Crear el usuario con contraseña encriptada
    const hashedPassword = await bcrypt.hash(password, 10);
    await connection.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
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