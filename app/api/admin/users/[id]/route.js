import mysql from "mysql2/promise";
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import path from 'path';
import bcrypt from "bcryptjs"; // bcryptjs es más compatible con Next.js

function validatePassword(password) {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!password || !strongPasswordRegex.test(password)) {
      return "Las contraseñas deben tener mayúsculas, minúsculas, números y un carácter especial.";
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
  const { id } = await params;
  const userId = id;
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
          "SELECT id, name, lastname, username, roleId, avatar, created_at FROM User WHERE id = ?",
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
export async function POST(req, context) {
  const { id } = await context.params;
  if (!id) {
    return new Response(JSON.stringify({ message: "ID no proporcionado" }), {
      status: 400,
    });
  }

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return new Response(
      JSON.stringify({ message: "Content-Type inválido, usa multipart/form-data" }),
      { status: 400 }
    );
  }

  let connection;
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const lastname = formData.get("lastname");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const roleId = formData.get("roleId");
    const avatar = formData.get("avatar");

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    let updates = [];
    let values = [];

    //cambio de nombre
    if (name) {
      const nameError = validateNameField(name, "Nombre");
      if (nameError) return new Response(JSON.stringify({ message: nameError }), { status: 400 });
      updates.push("name = ?");
      values.push(name);
    }
    //cambio de apellido
    if (lastname) {
      const lastnameError = validateNameField(lastname, "Apellido");
      if (lastnameError) return new Response(JSON.stringify({ message: lastnameError }), { status: 400 });
      updates.push("lastname = ?");
      values.push(lastname);
    }
    //cambio de contraseña
    if (password) {
      if (password !== confirmPassword) {
        return new Response(JSON.stringify({ message: "Las contraseñas no coinciden" }), { status: 400 });
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
    //cambio de rol
    if (roleId && !isNaN(roleId)) {
      const [roles] = await connection.execute("SELECT id FROM role WHERE id = ?", [roleId]);
      if (roles.length === 0) {
        return new Response(JSON.stringify({ message: "Role no válido" }), { status: 400 });
      }
      updates.push("roleId = ?");
      values.push(roleId);
    }
    //cambio de avatar
    if (avatar && avatar.name) {
      const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
      const avatarExtension = avatar.name.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(avatarExtension)) {
        return new Response(JSON.stringify({ message: "Formato de imagen no permitido" }), { status: 400 });
      }
      const uploadsPath = path.join(process.cwd(), "public/avatars");
      if (!existsSync(uploadsPath)) {
        mkdirSync(uploadsPath, { recursive: true });
      }
      let avatarPath= null;
      const uniqueFilename = crypto.randomUUID();
      const newAvatarFilename = `${uniqueFilename}.${avatarExtension}`;
      const avatarUploadPath = path.join(uploadsPath, newAvatarFilename);
      const avatarBytes = await avatar.arrayBuffer();
      const avatarBuffer = Buffer.from(avatarBytes);
      try{
        await writeFile(avatarUploadPath, avatarBuffer);
        avatarPath = `/avatars/${newAvatarFilename}`;
        console.log("Avatar guardado: ", newAvatarFilename)
      }catch(error){
        console.error("Error al guardar el avatar: ", error)
        return new Response(
          JSON.stringify({ success: false, message: "Error al guardar el avatar" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
      updates.push("avatar = ?");
      values.push(avatarPath);
    }

    const [existingUser] = await connection.execute("SELECT id FROM User WHERE id = ?", [id]);
    if (existingUser.length === 0) {
      return new Response(JSON.stringify({ message: "Usuario no encontrado" }), { status: 404 });
    }

    if (updates.length === 0) {
      return new Response(JSON.stringify({ message: "No hay cambios para actualizar" }), { status: 400 });
    }

    values.push(id);
    await connection.execute(`UPDATE User SET ${updates.join(", ")} WHERE id = ?`, values);

    return new Response(JSON.stringify({ message: "Usuario y foto de perfil actualizados exitosamente" }), { status: 200 });
  } catch (error) {
    console.error("Error al actualizar usuario y foto de perfil:", error);
    return new Response(JSON.stringify({ message: "Error interno del servidor" }), { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}



//DELETE
export async function DELETE(req, { params }) {
  const { id } = await params;
  const userId = id;

  try {

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    const [result] = await connection.execute("DELETE FROM User WHERE id = ?", [userId]);
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
