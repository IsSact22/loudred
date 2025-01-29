"use client";

// Components
import { PlaylistCard } from "@/src/components/cards/PlaylistCard";
import { useSession } from "next-auth/react";
import { useData } from "@/src/hooks/useData";
import React, { useEffect, useState } from "react";
import { usePlayerStore } from "@/src/stores/usePlayerStore";
import Link from "next/link";

export default function ProfilePage() {
  // Obtener la sesión actual
  const { data: session } = useSession();
  const [userSongs, setUserSongs] = useState([]);
  const { data = {}, isLoading, error } = useData("/songs");

  // Acceder al estado global del reproductor
  const { playSong, setPlaylist } = usePlayerStore();

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
              className="rounded-full object-cover w-40 h-40"
              src="/avatars/d86404c39b651bbf92ccefb4cc5d1826.jpg"
            />
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-7xl font-bold">Mi Perfil</h1>
            <h3 className="font-medium text-xl text-red-400">corta biografía</h3>
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
            <p>No has subido una canción aún
              <Link href="/upload" className="text-red-400 ml-1">
                ¡Sube una!
              </Link> 
            </p>
          ) : (
            <div className="space-y-4 mr-10">
              {/* Muestra cada canción usando PlaylistCard */}
              {userSongs.map((song, index) => (
                <PlaylistCard
                  key={song.id || index}
                  song={song}
                  onPlay={() => {
                    // Reproducir la canción seleccionada y establecer la lista de reproducción
                    setPlaylist(userSongs); // Configura todas las canciones del usuario
                    playSong(song, userSongs); // Reproduce la canción seleccionada
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
