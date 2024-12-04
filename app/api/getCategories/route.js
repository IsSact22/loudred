import {verifyToken} from "@/app/api/middleware/auth";
import { PrismaClient } from "@prisma/client";

const prisma= new PrismaClient();
export async function GET(req) {
    try{
         try{
            // Verificar el token
        let token;

        try {
        token = await verifyToken(req);
        console.log("Token recibido:", token);
        } catch (error) {
        console.error("Error en autenticación:", error.message);
        }
    }catch (error) {
        console.error("Error en autenticación:", error.message);
        return createErrorResponse("No autorizado", 401);
      }
      // Consultar las categorías desde la base de datos
      const categories = await prisma.categorias.findMany({
        select: {
            id: true,
            nombre: true,
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