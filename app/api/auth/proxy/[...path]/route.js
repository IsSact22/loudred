// app/api/proxy/[...path]/route.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function handler(request, { params }) {
  const token = await getToken({ req: request, secret });

  if (!token) {
    return NextResponse.json(
      { message: "No autorizado, autentíquese." },
      { status: 401 }
    );
  }

  const accessToken = token.accessToken;
  const { method } = request;
  const path = params.path.join("/");

  // Crear la URL interna basada en la ruta actual
  const requestUrl = new URL(request.url);
  const queryString = requestUrl.search;

  // Suponiendo que tu API interna esté bajo /api
  const url = `${requestUrl.origin}/api/${path}${queryString}`;

  let body = null;
  if (method !== "GET" && method !== "DELETE") {
    body = await request.json();
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Manejo de errores si la respuesta no es exitosa
    if (!response.ok) {
      const status = response.status;
      const responseData = await response.json();

      if (status === 403) {
        return NextResponse.json(
          {
            message: "Acceso denegado, no tienes permisos para esta acción.",
          },
          { status }
        );
      }

      return NextResponse.json(responseData, { status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en el proxy:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
