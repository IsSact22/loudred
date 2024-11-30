import { getToken } from "next-auth/jwt";

export async function getTokenId(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.id) {
      throw new Error("Token no válido o usuario no autenticado.");
    }

    return token.id; // Retorna el ID del usuario
  } catch (error) {
    console.error("Error al obtener el token:", error);
    return null;
  }
}
