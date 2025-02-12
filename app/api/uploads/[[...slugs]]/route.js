import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET(request, { params }) {
  const slugs = await params.slugs || [];
  const filePath = path.join(process.cwd(), "uploads", ...slugs);

  try {
    const fileBuffer = await fs.readFile(filePath);

    // Determinar el Content-Type según la extensión
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
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileBuffer.byteLength.toString(),
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error) {
    console.error("Error al leer el archivo:", error);
    return NextResponse.json(
      { error: "Archivo no encontrado" },
      { status: 404 }
    );
  }
}
