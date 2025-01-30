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
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function validateNameField(field, fieldName) {
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!field || !nameRegex.test(field)) {
    return `${fieldName} no puede contener números ni caracteres especiales.;`
  }
  return null;
}

//READ TODOS LOS USUARIOS
export async function GET(req) {
  try {
    // Conexión a la base de datos
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    // Consultar todos los usuarios
    const [users] = await connection.execute("SELECT id, name, lastname, username, roleId, avatar, created_at FROM User");
    await connection.end();

    return new Response(JSON.stringify(users), {
      status: 200,
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return new Response("Error interno del servidor", { status: 500 });
  }
}

// Crear (CREATE)
export async function POST(req) {
  let connection;
  try {
    const { name, lastname, username, password, confirmPassword } = await req.json();

// Validacion
const missingFields = [];

if (!name) missingFields.push("Nombre");
if (!lastname) missingFields.push("Apellido");
if (!username) missingFields.push("Usuario");
if (!password) missingFields.push("Contraseña");
if (!confirmPassword) missingFields.push("Confirmar contraseña");

if (missingFields.length > 0) {
  const errorMessage =
    missingFields.length === 5
      ? "Todos los campos son requeridos"
      : `Los siguientes campos son requeridos: ${missingFields.join(", ")}`;
  return createErrorResponse(errorMessage);
}

    // Validar nombre
    const nameError = validateNameField(name, "Nombre");
    if (nameError) {
      return createErrorResponse(nameError);
    }

    // Validar apellido
    const lastnameError = validateNameField(lastname, "Apellido");
    if (lastnameError) {
      return createErrorResponse(lastnameError);
    }

    // Validar usuario (formato)
    const UsuarRegex = /^[A-Z][a-z]*\d+$/;
    if (!UsuarRegex.test(username)) {
      return createErrorResponse(
        "El Usuario no es válido. Debe comenzar con una letra mayúscula, seguir con minúsculas y contener al menos un número."
      );
    }

    // Crear conexión a la base de datos para verificar duplicados
    connection = await mysql.createConnection({
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
      return createErrorResponse("El usuario ya existe", 409);
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      return createErrorResponse("Las contraseñas no coinciden");
    }

    // Validar contraseña
    const passwordError = validatePassword(password);
    if (passwordError) {
      return createErrorResponse(passwordError);
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Obtener el número total de usuarios para determinar si es SUPERADMIN o USER
    const [usersCount] = await connection.execute("SELECT COUNT(*) AS count FROM User");

    // Determinar el roleId según el número de usuarios existentes
    const roleId = usersCount[0].count < 4 ? 2 : 1; // 2 es para SUPERADMIN, 1 es para USER

    // Obtener el roleId de la tabla `role`
    const [role] = await connection.execute("SELECT id FROM role WHERE id = ?", [roleId]);

    // Si no se encuentra un role válido, devolver error
    if (!role || role.length === 0) {
      return createErrorResponse("Role no válido", 400);
    }

    // Insertar nuevo usuario con el roleId correspondiente y asignar avatar
    await connection.execute(
      "INSERT INTO User (name, lastname, username, password, roleId, avatar) VALUES (?, ?, ?, ?, ?, ?)",
      [name, lastname, username, hashedPassword, roleId, "/avatars/default-avatar.jpg"]
    );


    return new Response(
      JSON.stringify({ message: "Usuario creado exitosamente" }),
      { status: 201, }
    );
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return createErrorResponse("Error interno del servidor", 500);
  } finally {
    if (connection) {
      await connection.end(); // Asegurarse de cerrar la conexión al final
    }
  }
}
