import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Verificar el token
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET, // Usa el secreto de tu .env
    });

    // Log para ver si el token fue recibido
    console.log("Token recibido:", token);

    if (!token) {
      return new Response(
        JSON.stringify({ error: "No estás autenticado. Token inválido." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Si el token es válido, obtener los datos de la solicitud
    const { nombre, artista, categoria, status } = await req.json();

    // Validar que los campos necesarios estén presentes
    if (!nombre || !artista || !categoria || !status) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son obligatorios." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Crear una canción en la base de datos
    const newSong = await prisma.canciones.create({
      data: {
        nombre,
        artista,
        categoria,
        status,
        userId: token.id, // Vincular con el ID del usuario del token
      },
    });

    return new Response(
      JSON.stringify(newSong),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error en el endpoint /api/canciones:", error.message);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
