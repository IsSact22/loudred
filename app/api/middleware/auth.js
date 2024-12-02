import { getToken } from "next-auth/jwt";

export async function verifyToken(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    throw new Error("No estás autenticado. Token inválido.");
  }

  return token;
}