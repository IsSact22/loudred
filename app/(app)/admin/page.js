"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

// Columnas para la tabla de verificación
const verifyColumns = [
  { accessorKey: "verifySong", header: "Canción" }, // Nueva columna para el componente SongCard
];

// Datos para SongCard
const verifyData = [
  {
    id: 101,
    imageSrc: "/example1.jpg",
    title: "Canción A",
    artist: "Artista 1",
    album: "Álbum A",
  },
  {
    id: 102,
    imageSrc: "/example2.jpg",
    title: "Canción B",
    artist: "Artista 2",
    album: "Álbum B",
  },
  {
    id: 103,
    imageSrc: "/example3.jpg",
    title: "Canción C",
    artist: "Artista 3",
    album: "Álbum C",
  },
];

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState(null); // Estado para controlar la sección activa


  return (
    <div className="min-h-screen mr-16 bg-slate-950 text-white">
      {/* Header */}
      <header className="p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="text-5xl">👤</div>
          <h1 className="text-3xl font-bold">Administrador</h1>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <div className="flex gap-4">
            <Button
              onClick={() => setActiveSection("roles")}
              className={`${
                activeSection === "roles" ? "bg-red-700" : "bg-red-600"
              } hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full`}
            >
              Roles
            </Button>
            <Button
              onClick={() => setActiveSection("users")}
              className={`${
                activeSection === "users" ? "bg-red-700" : "bg-red-600"
              } hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full`}
            >
              Usuarios
            </Button>
            <Button
              onClick={() => setActiveSection("verify")}
              className={`${
                activeSection === "verify" ? "bg-red-700" : "bg-red-600"
              } hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full`}
            >
              Verificación
            </Button>
          </div>

          <Button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full flex items-center gap-2">
            Crear 
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="p-6"></main>
    </div>
  );
}
