import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  //console.log("Middleware - Token recibido:", token);

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

