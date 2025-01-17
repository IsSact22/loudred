"use client";
// Components
import SearchBar from "@/src/components/navegation/SearchBar";
import SongCarousel from "@/src/components/navegation/SongCarousel";
// React
import React from "react";

// Next
import { useSession } from "next-auth/react";

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
    <div className="flex h-screen bg-slate-950 flex-1 flex-col items-center justify-start p-6">
      {/* Contenido principal */}
      
        {/* Barra de búsqueda */}
        <div className="w-full max-w-2xl mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Carrusel */}
        <SongCarousel songs={songs} />

    </div>
  );
}
