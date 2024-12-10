import mysql from "mysql2/promise";
import { verifyToken } from '@/app/api/middleware/auth';

function validatePassword(password) {
  const strongPasswordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!password || !strongPasswordRegex.test(password)) {
    return "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.";
  }
  return null;
}

function validateNameField(field, fieldName) {
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!field || !nameRegex.test(field)) {
    return `${fieldName} no puede contener números ni caracteres especiales.;`
  }
  return null;
}


//READ UNO POR UNO
export async function GET(req, { params }) {
  try {
    // Esperar que params esté listo antes de acceder a sus propiedades
    const id = params?.id;

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID no proporcionado en la ruta" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verificar token
    try {
      const token = await verifyToken(req);
      if (!token) {
        return new Response(
          JSON.stringify({ error: "No autorizado" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }
      console.log("Token válido:", token);
    } catch (error) {
      console.error("Error en autenticación:", error.message);
      return new Response(
        JSON.stringify({ error: "No autorizado" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validar que el ID sea un número
    if (isNaN(Number(id))) {
      return new Response(
        JSON.stringify({ error: "El ID proporcionado no es válido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Conexión a la base de datos
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    // Buscar el usuario por ID
    const [user] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    await connection.end();

    if (user.length === 0) {
      return new Response(
        JSON.stringify({ error: "Usuario no encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Respuesta exitosa
    return new Response(JSON.stringify(user[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error interno del servidor:", error);

    // Manejo de errores internos
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


//UPDATE
export async function PUT(req, { params }) {
  const { id } = params; // Obtener el ID de la ruta
  const { name, lastname, password, confirmPassword, roleId } = await req.json();

  let connection;

  try {
    // Verificar token
    let token;
    try {
      token = await verifyToken(req);
      console.log("Token recibido:", token);
    } catch (error) {
      console.error("Error en autenticación:", error.message);
      return createErrorResponse("No autorizado", 401);
    }


    if (!name && !lastname && !password && !roleId) {
      return new Response(
        JSON.stringify({ message: "Debe proporcionar al menos un campo para actualizar" }),
        { status: 400 }
      );
    }

    let updates = [];
    let values = [];

    // Validar y agregar cambios al nombre
    if (name) {
      const nameError = validateNameField(name, "Nombre");
      if (nameError) {
        return new Response(JSON.stringify({ message: nameError }), {
          status: 400,
        });
      }
      updates.push("name = ?");
      values.push(name);
    }

    // Validar y agregar cambios al apellido
    if (lastname) {
      const lastnameError = validateNameField(lastname, "Apellido");
      if (lastnameError) {
        return new Response(JSON.stringify({ message: lastnameError }), {
          status: 400,
        });
      }
      updates.push("lastname = ?");
      values.push(lastname);
    }

    // Validar y agregar cambios a la contraseña
    if (password) {
      if (password !== confirmPassword) {
        return new Response(
          JSON.stringify({ message: "Las contraseñas no coinciden" }),
          { status: 400 }
        );
      }

      const passwordError = validatePassword(password);
      if (passwordError) {
        return new Response(JSON.stringify({ message: passwordError }), {
          status: 400,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push("password = ?");
      values.push(hashedPassword);
    }

    // Verificar si el roleId está presente y es válido
    if (roleId) {
      // Conectar a la base de datos
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      });

      // Validar que el roleId exista en la base de datos
      const [roles] = await connection.execute("SELECT id FROM role WHERE id = ?", [roleId]);

      if (roles.length === 0) {
        return new Response(JSON.stringify({ message: "Role no válido" }), {
          status: 400,
        });
      }

      updates.push("roleId = ?");
      values.push(roleId);
    }

    // Asegurar que el usuario existe antes de actualizar
    const [existingUser] = await connection.execute("SELECT id FROM users WHERE id = ?", [id]);
    if (existingUser.length === 0) {
      await connection.end();
      return new Response(JSON.stringify({ message: "Usuario no encontrado" }), {
        status: 404,
      });
    }

    // Ejecutar la actualización
    values.push(id); // Agregar el ID al final para WHERE
    await connection.execute(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    await connection.end();

    return new Response(
      JSON.stringify({ message: "Usuario actualizado exitosamente" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return new Response("Error interno del servidor", { status: 500 });
  } finally {
    if (connection) {
      await connection.end(); // Asegurarse de cerrar la conexión al final
    }
  }
}



//DELETE
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    let token;
    try {
      token = await verifyToken(req);
      console.log("Token recibido:", token);
    } catch (error) {
      console.error("Error en autenticación:", error.message);
      return createErrorResponse("No autorizado", 401);
    }


    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    const [result] = await connection.execute("DELETE FROM users WHERE id = ?", [id]);
    await connection.end();

    if (result.affectedRows === 0) {
      return new Response("Usuario no encontrado", { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Usuario eliminado exitosamente" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return new Response("Error interno del servidor", { status: 500 });
  }
}