import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Obtener la sesión del usuario
    const session = await getServerSession(authOptions);

    // Verificar si el usuario está autenticado
    if (!session || !session.user?.id) {
      return new Response(
        JSON.stringify({ error: "No estás autenticado" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Obtener los datos del cuerpo de la solicitud
    const { nombre, artista, categoria, status } = await req.json();

    // Validar que los campos estén presentes
    if (!nombre || !artista || !categoria || !status) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son obligatorios" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Crear la canción en la base de datos, asociando el userId
    const newSong = await prisma.canciones.create({
      data: {
        nombre,
        artista,
        categoria,
        status,
        userId: session.user.id, // Relacionar con el usuario autenticado
      },
    });

    return new Response(
      JSON.stringify(newSong),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error al registrar la canción:", error.message);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
