import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        // Consultar las categorías desde la base de datos
        const categories = await prisma.categories.findMany({
            select: {
                id: true,
                name: true,
            },
        });

        // Verificar si hay categorías
        if (!categories || categories.length === 0) {
            return new Response(JSON.stringify({ message: "No se encontraron categorías" }), { status: 404 });
        }

        // Respuesta exitosa con las categorías
        return new Response(JSON.stringify(categories), { status: 200 });
    }
    catch (error) {
        console.error("Error al obtener categorías:", error);
        return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
    } finally {
        // Cierra la conexión con Prisma al final
        await prisma.$disconnect();
    }
}