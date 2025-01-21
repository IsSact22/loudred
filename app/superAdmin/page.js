"use client";

import { useState } from "react";
import { DataTable } from "@/src/components/navegation/DataTable";
import { verifySong } from "@/src/components/cards/VerifySong"; // Importar SongCard

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

  const renderContent = () => {
    switch (activeSection) {
      case "roles":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b border-purple-500 pb-2">
              Roles
            </h2>
            <DataTable data={rolesData} columns={rolesColumns} />
          </div>
        );
      case "users":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b border-purple-500 pb-2">
              Usuarios
            </h2>
            <DataTable data={usersData} columns={usersColumns} />
          </div>
        );
      case "verify":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b border-purple-500 pb-2">
              Pendientes por aprobar
            </h2>
            {/* Tabla con SongCard */}
            <DataTable
              data={verifyData.map((item) => ({
                verifySong: (
                  <verifySong
                    key={item.id}
                    imageSrc={item.imageSrc}
                    title={item.title}
                    artist={item.artist}
                    album={item.album}
                  />
                ),
              }))}
              columns={verifyColumns}
            />
          </div>
        );
      default:
        return (
          <p className="text-lg mt-4">
            Selecciona una opción para ver su contenido.
          </p>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="text-5xl">👤</div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setActiveSection("roles")}
            className={`${
              activeSection === "roles" ? "bg-red-700" : "bg-red-600"
            } hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full`}
          >
            Roles
          </button>
          <button
            onClick={() => setActiveSection("users")}
            className={`${
              activeSection === "users" ? "bg-red-700" : "bg-red-600"
            } hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full`}
          >
            Usuarios
          </button>
          <button
            onClick={() => setActiveSection("verify")}
            className={`${
              activeSection === "verify" ? "bg-red-700" : "bg-red-600"
            } hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full`}
          >
            Verificación
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full ml-auto flex items-center gap-2">
            Crear <span className="text-xl">➕</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="p-6">{renderContent()}</main>
    </div>
  );
}
