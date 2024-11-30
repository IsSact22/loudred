import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // Permitir el acceso sin sesión solo a las rutas públicas
  if (pathname.startsWith("/api") || pathname === "/" || pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Redirigir si no hay token
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Aplica el middleware a rutas protegidas
export const config = {
  matcher: ["/home/:path*", "/dashboard/:path*"], // Rutas protegidas
};
