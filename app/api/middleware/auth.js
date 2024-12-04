import { getToken } from "next-auth/jwt";

export async function verifyToken(req) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      console.warn("No se encontró un token válido.");
      throw new Error("No estás autenticado. Token inválido.");
    }

    console.log("Token decodificado:", token); // Registro para depuración
    return token;
  } catch (error) {
    console.error("Error al verificar el token:", error.message);
    throw new Error("Error en la verificación del token.");
  }
}
