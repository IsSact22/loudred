import { verifyToken } from "@/app/api/middleware/auth";
import { NextResponse } from "next/server";

export async function middleware(req) {
  let token;

  try {
    token = await verifyToken(req);
    console.log("Token recibido:", token);
  } catch (error) {
    console.error("Error en autenticación:", error.message);
  }

  console.log("Middleware - Token recibido:", token);

  const { pathname } = req.nextUrl;

  // Permitir acceso a rutas públicas
  if (pathname.startsWith("/api") || pathname === "/" || pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Redirigir si no hay token
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();

}

// Configurar rutas protegidas
export const config = {
  matcher: ["/home/:path*", "/dashboard/:path*"],
};

