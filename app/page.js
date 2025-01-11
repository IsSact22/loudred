"use client";
// Components
import SidebarLeft from "@/src/components/bars/SidebarLeft";
import SidebarRight from "@/src/components/bars/SidebarRight"; 
import SearchBar from "@/src/components/navegation/SearchBar";
import SongCarousel from "@/src/components/navegation/SongCarousel";
// React
import React from "react";

// Next
import { useSession } from "next-auth/react";
// Utils
import { broadcastLogout } from "@/src/utils/authChannel";

export default function Home() {
  const { data: session } = useSession();

  // Usar directamente el rol desde la sesión
  const userRoleName = session?.user?.role?.name;

  const handleSearch = (query) => {
    console.log("Buscando:", query);
  };

  // Esto va a cambiar cuando ya estemos trabajando con los datos reales de las canciones
  const songs = [
    {
      image: "assets/image.png",
      title: "Song Title 1",
      artist: "Artist 1",
    },
    {
      image: "/path-to-image2.jpg",
      title: "Song Title 2",
      artist: "Artist 2",
    },
    {
      image: "/path-to-image3.jpg",
      title: "Song Title 3",
      artist: "Artist 3",
    },
    {
      image: "/path-to-image3.jpg",
      title: "Song Title 3",
      artist: "Artist 3",
    },
    {
      image: "/path-to-image3.jpg",
      title: "Song Title 3",
      artist: "Artist 3",
    },
    {
      image: "/path-to-image3.jpg",
      title: "Song Title 3",
      artist: "Artist 3",
    },
    {
      image: "/path-to-image3.jpg",
      title: "Song Title 3",
      artist: "Artist 3",
    },
    {
      image: "/path-to-image3.jpg",
      title: "Song Title 3",
      artist: "Artist 3",
    },
    {
      image: "/path-to-image3.jpg",
      title: "Song Title 3",
      artist: "Artist 3",
    },
  ];

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar izquierdo */}
      <div className="w-64">
        <SidebarLeft />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center justify-start p-6 ml-64 mr-64">
        {/* Barra de búsqueda */}
        <div className="w-full max-w-2xl mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Carrusel */}
        <SongCarousel songs={songs} />

        <div>
            {/* Aquí puedes agregar el contenido adicional */}
        </div>
      </div>

      {/* Sidebar derecho */}
      <div className="w-64 bg-slate-800 fixed right-0 top-0 bottom-0">
        <SidebarRight />
      </div>
    </div>
  );
}
