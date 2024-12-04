import { verifyToken } from "@/app/api/middleware/auth"; 
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    let token;

    // Verificar el token
    try {
      token = await verifyToken(req);
      console.log("Token recibido:", token);
    } catch (error) {
      console.error("Error en autenticación:", error.message);
      return new Response(
        JSON.stringify({ message: "No autorizado" }),
        { status: 401 }
      );
    }

    // Obtener el ID de usuario desde los parámetros de consulta
    const url = new URL(req.url);
    const userId = url.searchParams.get("id");

    if (!userId) {
      return new Response(
        JSON.stringify({ message: "ID de usuario no proporcionado" }),
        { status: 400 }
      );
    }

    // Consultar el roleId del usuario desde la base de datos
    const userRole = await prisma.users.findUnique({
      where: { id: parseInt(userId) },
      select: {
        roleId: true, // Esto asume que tu tabla de usuarios tiene un campo roleId
      },
    });

    if (!userRole) {
      return new Response(
        JSON.stringify({ message: "Usuario no encontrado" }),
        { status: 404 }
      );
    }

    // Responder con el roleId del usuario
    return new Response(
      JSON.stringify({ roleId: userRole.roleId }), // Devuelve el roleId
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener el rol del usuario:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  } finally {
    // Cerrar la conexión con Prisma
    await prisma.$disconnect();
  }
}
