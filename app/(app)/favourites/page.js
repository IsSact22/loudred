"use client";

// Components
import { PlaylistCard } from "@/src/components/cards/PlaylistCard";
import { useSession } from "next-auth/react";
import { useData } from "@/src/hooks/useData";
import React, { useEffect, useState } from "react";
import { usePlayerStore } from "@/src/stores/usePlayerStore";

export default function FavoritesPage() {
  const { data: session } = useSession();
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const { data = {}, isLoading, error } = useData(
    `/favourite?userId=${session?.user?.id}`
  );
  const { playSong, setPlaylist } = usePlayerStore();

  useEffect(() => {
    if (data?.songs) {
      console.log("Canciones favoritas obtenidas:", data.songs); // Depuración
      setFavoriteSongs(data.songs);
    }
  }, [data]);

  if (isLoading) {
    return <div className="m-4">Cargando canciones favoritas...</div>;
  }



   
  return (
    <div className="min-h-screen bg-slate-950 text-white mr-10">
      {/* Header */}
      <header className="p-6 flex flex-col gap-4 items-start">
        <div className="flex items-center gap-3">
          <div className="text-5xl">
            <img
              className="object-cover w-40 h-40"
              src="/assets/4ec6d19b856fe4557baf4385e90b6cf7-removebg-preview.png"
              alt="Mis favoritos"
            />
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-7xl font-bold">Mis Favoritos</h1>
            <h3 className="font-medium text-xl text-red-400">
              Las canciones que no puedes parar de escuchar
            </h3>
          </div>
        </div>
      </header>

      {/* Tabla de canciones */}
      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4 border-b border-purple-500 mr-10 pb-2">
          Mis Canciones Favoritas
        </h2>
        <div>
          {favoriteSongs.length === 0 ? (
            <p>No has guardado ninguna canción aún ¡Agrega una!</p>
          ) : (
            <div className="space-y-4 mr-10">
              {favoriteSongs.map((song, index) => (
                <PlaylistCard
                  key={song.id || index}
                  song={song}
                  onPlay={() => {
                    console.log("Reproduciendo canción:", song); // Depuración
                    setPlaylist(favoriteSongs);
                    playSong(song, favoriteSongs);
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
