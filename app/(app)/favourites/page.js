"use client";

// Components
import { PlaylistCard } from "@/src/components/cards/PlaylistCardFav";
import { useSession } from "next-auth/react";
import { useData } from "@/src/hooks/useData";
import React, { useEffect, useState } from "react";
import { usePlayerStore } from "@/src/stores/usePlayerStore";


export default function FavoritesPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Asegurarse de que no se haga la petición si userId es undefined
  const { data = {}, isLoading } = useData(userId ? `/favourite?userId=${userId}` : null);
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const { playSong, setPlaylist } = usePlayerStore();

  useEffect(() => {
    if (data?.songs) {
      console.log("Canciones favoritas obtenidas:", data.songs);
      setFavoriteSongs(data.songs);
    }
  }, [data]);

  const handleRemoveFromFavorites = (song) => {
    setFavoriteSongs((prev) => prev.filter((s) => s.id !== song.id));
  };

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
              {favoriteSongs.map((song) => (
                <PlaylistCard
                  key={song.id}
                  song={song}
                  onPlay={() => {
                    console.log("Reproduciendo canción:", song);
                    setPlaylist(favoriteSongs);
                    playSong(song, favoriteSongs);
                  }}
                  userId={userId}
                  onRemove={handleRemoveFromFavorites}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
