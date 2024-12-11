import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Usuario no autenticado
  if (!token) {
    // Permitir rutas de autenticación
    if (pathname.startsWith("/auth")) return NextResponse.next();
    // Permitir rutas de APIs de autenticación
    if (pathname.startsWith("/api/auth")) return NextResponse.next();
    // Si es una ruta API, responder con 401 JSON
    if (pathname.startsWith("/api")) {
      return new NextResponse(JSON.stringify({ message: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Redirigir a login para otras rutas
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Usuario autenticado
  // Redirigir al home si intenta acceder a rutas de auth
  if (pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Permitir acceso a otras rutas
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};