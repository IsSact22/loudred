"use client";
// Components
import { PlaylistCard } from "@/src/components/cards/PlaylistCard";
import { useSession } from "next-auth/react";
import { useData } from "@/src/hooks/useData"; // Asegúrate de tener este hook
import React, { useEffect, useState } from "react";

export default function ProfilePage() {
  // Obtener la sesión actual
  const { data: session } = useSession();
  const [userSongs, setUserSongs] = useState([]);
  const { data = {}, isLoading, error } = useData("/songs");

  // Filtrar las canciones del usuario
  useEffect(() => {
    if (session?.user?.id && data?.songs) {
      const userSongs = data.songs.filter((song) => song.userId === session.user.id);
      setUserSongs(userSongs);
    }
  }, [session, data]);

  if (isLoading) {
    return <div className="m-4">Cargando canciones...</div>;
  }

  if (error) {
    return <div className="m-4">Error al cargar las canciones: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white mr-10">
      {/* Header */}
      <header className="p-6 flex flex-col gap-4 items-start">
        <div className="flex items-center gap-3">
          <div className="text-5xl">
            <img
              className=" object-cover w-40 h-40"
              src="/assets/4ec6d19b856fe4557baf4385e90b6cf7-removebg-preview.png"
            />
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-7xl font-bold">Mis favoritos</h1>
            <h3 className="font-medium text-xl text-red-400">Las canciones que no puedes parar de escuchar</h3>
          </div>
        </div>
      </header>

      {/* Tabla de canciones */}
      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4 border-b border-purple-500 mr-10 pb-2">
          Mis Canciones
        </h2>
        <div>
          {/* Si no hay canciones */}
          {userSongs.length === 0 ? (
            <p>No tienes canciones disponibles.</p>
          ) : (
            <div className="space-y-4 mr-10">
              {/* Muestra cada canción usando PlaylistCard */}
              {userSongs.map((song, index) => (
                <PlaylistCard
                  key={song.id || index}
                  song={song}
                  onPlay={(song) => {
                    // Aquí puedes llamar a la función onPlay desde el contexto para actualizar la canción en el reproductor
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
