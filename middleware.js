import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Usuario no autenticado
  if (!token) {
    // Permitir rutas de autenticación
    if (pathname.startsWith("/auth")) return NextResponse.next();
    // Redirigir a login si intenta acceder a otras rutas
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
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
