import mysql from "mysql2/promise";

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

// READ UNO POR UNO CON CANCIONES QUE HAN SUBIDO
export async function GET(req, { params }) {
  const userId = params?.id;
  const { search } = Object.fromEntries(new URL(req.url).searchParams);

  try {
    // Configuración de conexión a la base de datos
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    try {
      if (userId) {
        if (isNaN(Number(userId))) {
          return new Response(
            JSON.stringify({ error: "El ID proporcionado no es válido" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        // Buscar el usuario por ID
        const [user] = await connection.execute(
          "SELECT id, name, lastname, username, roleId, created_at FROM User WHERE id = ?",
          [userId]
        );

        if (user.length === 0) {
          return new Response(
            JSON.stringify({ error: "Usuario no encontrado" }),
            { status: 404, headers: { "Content-Type": "application/json" } }
          );
        }

        // Consultar canciones con imagen y música
        const [songs] = await connection.execute(
          `
          SELECT 
            Songs.id AS songId,
            Songs.title,
            Songs.validate,
            Songs.createdAt,
            Songs.categoryId,
            categories.name AS categoryName,
            Image.fileName AS imageFileName,
            Music.fileName AS musicFileName
          FROM Songs
          LEFT JOIN categories ON Songs.categoryId = categories.id
          LEFT JOIN Image ON Songs.id = Image.songId
          LEFT JOIN Music ON Songs.id = Music.songId
          WHERE Songs.userId = ? AND Songs.title LIKE ?
          `,
          [userId, `%${search || ""}%`]
        );

        const formattedSongs = songs.map((song) => ({
          songId: song.songId,
          title: song.title,
          validate: song.validate,
          createdAt: song.createdAt,
          categoryId: song.categoryId,
          categoryName: song.categoryName || null,
          image: song.imageFileName ? `${song.imageFileName}` : null,
          music: song.musicFileName ? `${song.musicFileName}` : null,
        }));

        const message = formattedSongs.length === 0 
          ? (search 
            ? "El usuario no tiene canciones que coincidan con la búsqueda."
            : "El usuario no tiene canciones disponibles aún.")
          : undefined;

        const response = {
          ...user[0],
          songs: formattedSongs,
          message,
        };

        return new Response(JSON.stringify(response), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Caso de búsqueda global (sin cambios)
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error("Error interno del servidor:", error);
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
    const [existingUser] = await connection.execute("SELECT id FROM User WHERE id = ?", [id]);
    if (existingUser.length === 0) {
      await connection.end();
      return new Response(JSON.stringify({ message: "Usuario no encontrado" }), {
        status: 404,
      });
    }

    // Ejecutar la actualización
    values.push(id); // Agregar el ID al final para WHERE
    await connection.execute(
      `UPDATE User SET ${updates.join(", ")} WHERE id = ?`,
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

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    const [result] = await connection.execute("DELETE FROM User WHERE id = ?", [id]);
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
