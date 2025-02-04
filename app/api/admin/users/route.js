import { Pool } from "pg";
import bcrypt from "bcryptjs";

// Configurar pool de conexiones global
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

function validatePassword(password) {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
  if (!password || !strongPasswordRegex.test(password)) {
    return "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.";
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
    return `${fieldName} no puede contener números ni caracteres especiales.`;
  }
  return null;
}

//  **READ - Obtener todos los usuarios**
export async function GET(req) {
  let client;
  try {
    client = await pool.connect(); // Obtener conexión desde el pool
    const result = await client.query(
      'SELECT "id", "name", "lastname", "username", "roleId", "avatar", "created_at" FROM "User"'
    );
    
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return createErrorResponse("Error interno del servidor", 500);
  } finally {
    if (client) client.release(); // Liberar la conexión
  }
}

//  **CREATE - Crear un nuevo usuario**
export async function POST(req) {
  let client;
  try {
    const { name, lastname, username, password, confirmPassword } =
      await req.json();

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

    //  Validar nombre y apellido
    const nameError = validateNameField(name, "Nombre");
    if (nameError) return createErrorResponse(nameError);

    const lastnameError = validateNameField(lastname, "Apellido");
    if (lastnameError) return createErrorResponse(lastnameError);

    //  Validar usuario
    const userRegex = /^[A-Z][a-z]*\d+$/;
    if (!userRegex.test(username)) {
      return createErrorResponse(
        "El usuario debe comenzar con una mayúscula, seguir con minúsculas y contener al menos un número."
      );
    }

    client = await pool.connect(); // Obtener conexión

    //  **Verificar si el usuario ya existe**
    const existingUser = await client.query(
      `SELECT id FROM "user" WHERE username = $1`,
      [username]
    );

    if (existingUser.rows.length > 0) {
      return createErrorResponse("El usuario ya existe", 409);
    }

    //  Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      return createErrorResponse("Las contraseñas no coinciden");
    }

    //  Validar contraseña
    const passwordError = validatePassword(password);
    if (passwordError) return createErrorResponse(passwordError);

    //  **Hash de la contraseña**
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
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return createErrorResponse("Error interno del servidor", 500);
  } finally {
    if (client) client.release(); // Liberar conexión
  }
}
