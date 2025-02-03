"use client";

// Components
import { PlaylistCard } from "@/src/components/cards/PlaylistCardFav";
import { useSession } from "next-auth/react";
import { useData } from "@/src/hooks/useData";
import React, { useEffect, useState } from "react";
import { usePlayerStore, usePlayerActions } from "@/src/stores/playerStore";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function FavoritesPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data, isLoading, error } = useData(
    userId ? `/favourite?userId=${userId}` : null
  );
  const [favoriteSongs, setFavoriteSongs] = useState([]);

  // Usar acciones del store correctamente
  const { playSong, setPlaylist } = usePlayerActions();
  const { currentSong, isPlaying } = usePlayerStore();

  useEffect(() => {
    if (data?.songs) {
      setFavoriteSongs(data.songs);
      // Actualizar la playlist del reproductor si es la misma lista
      setPlaylist(data.songs);
    }
  }, [data, setPlaylist]);

  const handleRemoveFromFavorites = async (song) => {
    try {
      // Lógica para eliminar de favoritos
      setFavoriteSongs((prev) => prev.filter((s) => s.id !== song.id));
      toast.success("Canción eliminada de favoritos");
    } catch (error) {
      toast.error("Error al eliminar de favoritos");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white mr-10 p-6">
        <Skeleton className="h-10 w-48 mb-4" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white mr-10">
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

      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4 border-b border-purple-500 mr-10 pb-2">
          Mis Canciones Favoritas
        </h2>

        {favoriteSongs.length === 0 ? (
          <div className="text-gray-400">
            <p>No has guardado ninguna canción aún</p>
            <Link
              href="/"
              className="text-red-400 hover:text-red-300 mt-2 inline-block"
            >
              ¡Descubre música nueva!
            </Link>
          </div>
        ) : (
          <div className="space-y-4 mr-10">
            {favoriteSongs.map((song) => (
              <PlaylistCard
                key={song.id}
                song={song}
                isPlaying={currentSong?.id === song.id && isPlaying}
                onPlay={() => {
                  try {
                    playSong(song, favoriteSongs);
                  } catch (error) {
                    toast.error("Error al reproducir la canción");
                  }
                }}
                userId={userId}
                onRemove={handleRemoveFromFavorites}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
