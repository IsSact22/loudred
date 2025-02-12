import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET(request, { params }) {
  // Usamos "slugs" porque el archivo se llama [[...slugs]]
  const params2 = await params
  const slugs = await params2.slugs || [];
  // Construimos la ruta completa en base a la carpeta "uploads" que está en la raíz
  const filePath = path.join(process.cwd(), "uploads", ...slugs);

  try {
    const fileBuffer = await fs.readFile(filePath);

    // Determinar el Content-Type según la extensión del archivo
    const ext = path.extname(filePath).toLowerCase();
    let contentType = "application/octet-stream";
    if (ext === ".jpg" || ext === ".jpeg") {
      contentType = "image/jpeg";
    } else if (ext === ".png") {
      contentType = "image/png";
    } else if (ext === ".gif") {
      contentType = "image/gif";
    } else if (ext === ".mp3") {
      contentType = "audio/mpeg";
    }

    return new NextResponse(fileBuffer, {
      headers: { "Content-Type": contentType },
    });
  } catch (error) {
    console.error("Error al leer el archivo:", error);
    return NextResponse.json(
      { error: "Archivo no encontrado" },
      { status: 404 }
    );
  }
}
