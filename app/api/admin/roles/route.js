import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Consultar los roles desde la base de datos
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
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