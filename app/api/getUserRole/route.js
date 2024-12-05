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

    // Consultar los roles desde la base de datos
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true, // Selecciona los campos relevantes
        users: false, // Ignora la relación si no es necesaria
      },
    });

    // Verificar si hay roles
    if (!roles || roles.length === 0) {
      return new Response(
        JSON.stringify({ message: "No se encontraron roles" }),
        { status: 404 }
      );
    }

    // Respuesta exitosa con los roles
    return new Response(JSON.stringify(roles), { status: 200 });
  } catch (error) {
    console.error("Error al obtener roles:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  } finally {
    // Cierra la conexión con Prisma al final
    await prisma.$disconnect();
  }
}
