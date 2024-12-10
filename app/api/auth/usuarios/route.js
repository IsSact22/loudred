import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/app/api/middleware/auth";

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
    // Verificación de token
    let token;
    try {
      token = await verifyToken(req);
      console.log("Token recibido:", token);
    } catch (error) {
      console.error("Error en autenticación:", error.message);
      return createErrorResponse("No autorizado", 401);
    }

    // Conexión a la base de datos
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    // Consultar todos los usuarios
    const [users] = await connection.execute("SELECT * FROM users");
    await connection.end();

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
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
    // Verificación de token
    let token;
    try {
      token = await verifyToken(req);
      console.log("Token recibido:", token);
    } catch (error) {
      console.error("Error en autenticación:", error.message);
      return createErrorResponse("No autorizado", 401);
    }

    const { name, lastname, usuario, password, confirmPassword } = await req.json();

    // Validaciones iniciales
    if (!name || !lastname || !usuario || !password || !confirmPassword) {
      return createErrorResponse("Todos los campos son requeridos");
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
    if (!UsuarRegex.test(usuario)) {
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
      "SELECT * FROM users WHERE usuario = ?",
      [usuario]
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
    const [usersCount] = await connection.execute("SELECT COUNT(*) AS count FROM users");

    // Determinar el roleId según el número de usuarios existentes
    const roleId = usersCount[0].count < 4 ? 2 : 1; // 2 es para SUPERADMIN, 1 es para USER

    // Obtener el roleId de la tabla `role`
    const [role] = await connection.execute("SELECT id FROM role WHERE id = ?", [roleId]);

    // Si no se encuentra un role válido, devolver error
    if (!role || role.length === 0) {
      return createErrorResponse("Role no válido", 400);
    }

    // Insertar nuevo usuario con el roleId correspondiente
    await connection.execute(
      "INSERT INTO users (name, lastname, usuario, password, roleId) VALUES (?, ?, ?, ?, ?)",
      [name, lastname, usuario, hashedPassword, roleId]
    );

    return new Response(
      JSON.stringify({ message: "Usuario creado exitosamente" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
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
