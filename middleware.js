import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Si no hay token (usuario no autenticado)
  if (!token) {
    // Permitir acceso a rutas de autenticación
    if (pathname.startsWith("/auth")) {
      return NextResponse.next();
    } else {
      // Redirigir al usuario no autenticado a "/auth/login"
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  } else {
    // Si hay token (usuario autenticado)
    // Redirigir a "/" si intenta acceder a "/auth/login" o "/auth/register"
    if (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register")) {
      return NextResponse.redirect(new URL("/", req.url));
    } else {
      // Permitir acceso a otras rutas
      return NextResponse.next();
    }
  }
}

// Configurar rutas protegidas
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};