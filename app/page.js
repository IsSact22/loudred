"use client";
// Components
import SearchBar from "@/src/components/navegation/SearchBar";
import SongCarousel from "@/src/components/navegation/SongCarousel";
// React
import React from "react";
// Next
import { useSession } from "next-auth/react";
// Hooks
import { useData } from "@/src/hooks/useData";

export default function Home() {
  //const { data: session } = useSession();
  // Obtener las canciones desde la API
  const { data = {}, isLoading, error } = useData("/songs");
  const songs = data.songs ?? [];

  // Si las canciones están cargando o hay un error
  if (isLoading) {
    return <div className="m-4">Cargando canciones...</div>;
  }

  if (error) {
    return <div className="m-4">Error al cargar las canciones: {error}</div>;
  }


// buscador
  const handleSearch = (query) => {
    console.log("Buscando:", query);
  };
 

  return (
    <div className="flex h-screen bg-slate-950 flex-1 flex-col  justify-start p-6">
      {/* Contenido principal */}
      
        {/* Barra de búsqueda */}
        <div className="w-full max-w-2xl mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Carrusel */}
        <div className="mt-10 ml-10">
        <p className="text-white">Agregados recientemente</p>
        <SongCarousel songs={songs} />
      </div>

    </div>
  );
}
