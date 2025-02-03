"use client";
// Components
import SearchBar from "@/src/components/navegation/SearchBar";
import SongCarousel from "@/src/components/navegation/SongCarousel";
import UserCarousel from "@/src/components/navegation/UserCarousel";
// React
import React from "react";
// Hooks
import { useData } from "@/src/hooks/useData";

export default function Home() {
  //const { data: session } = useSession();
  // Obtener las canciones desde la API
  const {
    data: songData = {},
    isLoading: loadingSongs,
    error: errorSongs,
  } = useData("/songs");
  const songs = songData.songs ?? [];

  //Obtener los usuarios desde la api
  const {
    data: userData = {},
    isLoading: loadingUsers,
    error: errorUsers,
  } = useData("/admin/users");
  const users = userData ?? []; // <-- Ajusta esto para evitar errores si userData es undefined o null

  // buscador
  const handleSearch = (query) => {
    console.log("Buscando:", query);
  };

  return (
    <div className="flex h-screen bg-slate-950 flex-1 flex-col  justify-start p-6">
      {/* Contenido principal */}

      {/* Barra de búsqueda */}
      <div className="w-full max-w-2xl mt-2 mb-4 ml-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Carrusel */}
      <div className="mt-10 ml-10">
        <p className="text-white text-2xl">Agregados recientemente</p>
        {loadingSongs ? (
          <p className="mt-4 text-white">Cargando canciones...</p>
        ) : errorSongs ? (
          <p className="mt-4 text-white">Error al cargar canciones</p>
        ) : (
          <SongCarousel songs={songs} />
        )}
      </div>

      {/* Carrusel */}
      <div className="mt-20 ml-10">
        <p className="text-white text-2xl">Nuevos usuarios</p>
        {loadingUsers ? (
          <p className="m-4">Cargando usuarios...</p>
        ) : errorUsers ? (
          <p>Error al cargar usuarios</p>
        ) : (
          <>
            <UserCarousel users={users} />
          </>
        )}
      </div>
    </div>
  );
}
