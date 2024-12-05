import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/middleware/auth";

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
    return `${fieldName} no puede contener números ni caracteres especiales.`;
  }
  return null;
}

// Crear (CREATE)
export async function POST(req) {
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

    const { name, lastname, usuario, password, confirmPassword } =
      await req.json();

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
    const connection = await mysql.createConnection({
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
      await connection.end(); // Cerrar conexión
      return createErrorResponse("El usuario ya existe", 409);
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      await connection.end(); // Cerrar conexión en caso de error
      return createErrorResponse("Las contraseñas no coinciden");
    }

    // Validar contraseña
    const passwordError = validatePassword(password);
    if (passwordError) {
      await connection.end(); // Cerrar conexión en caso de error
      return createErrorResponse(passwordError);
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar nuevo usuario en la base de datos
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

// Leer (READ)
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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // Obtener el ID desde los parámetros de la URL

    if (!id) {
      return createErrorResponse("El ID es requerido");
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
      return createErrorResponse("Usuario no encontrado", 404);
    }

    return new Response(JSON.stringify(user[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return createErrorResponse("Error interno del servidor", 500);
  }
}

// Actualizar (UPDATE)
export async function PUT(req) {
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

    const { name, lastname, password, confirmPassword, roleId } = await req.json();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return createErrorResponse("El ID es requerido");
    }

    if (!name && !lastname && !password && !roleId) {
      return createErrorResponse("Debe proporcionar al menos un campo para actualizar");
    }

    let updates = [];
    let values = [];

    // Verificar si se proporciona un nuevo nombre
    if (name) {
      const nameError = validateNameField(name, "Nombre");
      if (nameError) {
        return createErrorResponse(nameError);
      }
      updates.push("name = ?");
      values.push(name);
    }

    // Verificar si se proporciona un nuevo apellido
    if (lastname) {
      const lastnameError = validateNameField(lastname, "Apellido");
      if (lastnameError) {
        return createErrorResponse(lastnameError);
      }
      updates.push("lastname = ?");
      values.push(lastname);
    }

    // Verificar si se proporciona una nueva contraseña
    if (password) {
      if (password !== confirmPassword) {
        return createErrorResponse("Las contraseñas no coinciden");
      }

      const passwordError = validatePassword(password);
      if (passwordError) {
        return createErrorResponse(passwordError);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push("password = ?");
      values.push(hashedPassword);
    }

    // Si se proporciona un nuevo roleId, validar si existe en la base de datos
    if (roleId) {
      const role = await prisma.role.findUnique({
        where: { id: roleId },
      });
      if (!role) {
        return createErrorResponse("El rol proporcionado no existe", 404);
      }
      updates.push("roleId = ?");
      values.push(roleId);
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


// Borrar (DELETE)
export async function DELETE(req) {
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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // Obtener el ID desde los parámetros de la URL

    if (!id) {
      return createErrorResponse("El ID es requerido");
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
      return createErrorResponse("Usuario no encontrado o ya eliminado", 404);
    }

    return new Response(
      JSON.stringify({ message: "Usuario eliminado exitosamente" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return createErrorResponse("Error interno del servidor", 500);
  }
}
