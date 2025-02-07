import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // Instanciamos prisma

// Agregar canción a favoritos
export async function POST(req) {
    try {
      const data = await req.json(); // Obtener datos del cuerpo de la solicitud
      const { userId, songId } = data;
      const missingFields = [];
  
      if (!userId) missingFields.push("userId");
      if (!songId) missingFields.push("songId");
  
      if (missingFields.length > 0) {
        const errorMessage =
          missingFields.length === 2
            ? "Todos los campos son requeridos"
            : `Los siguientes campos son requeridos: ${missingFields.join(", ")}`;
        return createErrorResponse(errorMessage);
      }
  
      // Verificar si el usuario y la canción existen
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const song = await prisma.songs.findUnique({ where: { id: songId } });
  
      if (!user || !song) {
        return new Response(
          JSON.stringify({ error: "Usuario o canción no encontrados." }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
  
      // Verificar si la playlist de Favoritos ya existe para el usuario
      let playlist = await prisma.playlist.findFirst({
        where: { userId: userId, name: "Favoritos" },
      });
  
      // Si no existe la playlist, la creamos
      if (!playlist) {
        playlist = await prisma.playlist.create({
          data: {
            userId: userId,
            name: "Favoritos",
          },
        });
      }
  
      // Agregar la canción a la playlist de Favoritos
      await prisma.playlist.update({
        where: { id: playlist.id },
        data: {
          Songs: {
            connect: { id: songId },
          },
        },
      });
  
      return new Response(
        JSON.stringify({ message: "Canción agregada a Favoritos." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      // Verificamos si el error es un objeto y tiene propiedades
      const errorMessage = error && error instanceof Error ? error.message : "Unknown error";
  
      // Asegúrate de que el error no sea null o un tipo incorrecto
      console.error("Error al agregar canción a favoritos", errorMessage);
  
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }

// Obtener canciones de favoritos
export async function GET(req) {
  try {
      const userId = req.nextUrl.searchParams.get('userId');

      if (!userId) {
          return new Response(
              JSON.stringify({ error: "Se requiere userId." }),
              { status: 400, headers: { "Content-Type": "application/json" } }
          );
      }

      // Obtener la playlist de Favoritos del usuario
      const playlist = await prisma.playlist.findFirst({
          where: { userId: parseInt(userId), name: "Favoritos" },
          include: { 
              Songs: {
                  include: {
                      categories: true,  // Incluir información de la categoría
                      Image: true,       // Incluir imágenes
                      Music: true        // Incluir archivos de audio
                  }
              }
          },
      });

      if (!playlist) {
          return new Response(
              JSON.stringify({ error: "No se encontró la playlist de Favoritos." }),
              { status: 404, headers: { "Content-Type": "application/json" } }
          );
      }

      // Transformar la respuesta para incluir la información relevante
      const songs = playlist.Songs.map(song => ({
          id: song.id,
          title: song.title,
          validate: song.validate,
          createdAt: song.createdAt,
          userId: song.userId,
          categoryId: song.categoryId,
          categoryName: song.categories?.name || null,
          image: song.Image.length > 0 ? `${song.Image[0].fileName}` : null,
          music: song.Music.length > 0 ? `${song.Music[0].fileName}` : null,
      }));

      return new Response(
          JSON.stringify({ songs }),
          { status: 200, headers: { "Content-Type": "application/json" } }
      );
  } catch (error) {
      console.error("Error al obtener canciones de favoritos", error);
      return new Response(
          JSON.stringify({ error: "Error interno del servidor." }),
          { status: 500, headers: { "Content-Type": "application/json" } }
      );
  }
}

export async function DELETE(req) {
  try {
    // Extraer los parámetros desde la URL
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const songId = searchParams.get("songId");

    if (!userId || !songId) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son requeridos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verificar si el usuario y la canción existen en la base de datos
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const song = await prisma.songs.findUnique({ where: { id: songId } });

    if (!user || !song) {
      return new Response(
        JSON.stringify({ error: "Usuario o canción no encontrados." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Buscar la playlist de Favoritos del usuario
    let playlist = await prisma.playlist.findFirst({
      where: { userId, name: "Favoritos" },
      include: { Songs: true },
    });

    if (!playlist) {
      return new Response(
        JSON.stringify({ error: "La playlist de Favoritos no existe." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verificar si la canción está en la playlist
    const songInPlaylist = playlist.Songs.some((song) => song.id === songId);
    if (!songInPlaylist) {
      return new Response(
        JSON.stringify({
          error: "La canción no está en la lista de Favoritos.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Eliminar la canción de la playlist
    await prisma.playlist.update({
      where: { id: playlist.id },
      data: {
        Songs: {
          disconnect: { id: songId },
        },
      },
    });

    return new Response(
      JSON.stringify({ message: "Canción eliminada de Favoritos." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error interno del servidor:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

