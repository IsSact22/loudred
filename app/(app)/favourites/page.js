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
import Image from "next/image";

export default function FavoritesPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data, isLoading, error } = useData(
    userId ? `/favourite?userId=${userId}` : null
  );
  const [favoriteSongs, setFavoriteSongs] = useState([]);

  // Acciones del store
  const { playSong, setPlaylist } = usePlayerActions();
  const { currentSong, isPlaying } = usePlayerStore();

  useEffect(() => {
    if (data?.songs) {
      setFavoriteSongs(data.songs);
    }
  }, [data]);

  // Usamos useEffect para actualizar la playlist solo cuando favoriteSongs cambia
  useEffect(() => {
    setPlaylist(favoriteSongs);
  }, [favoriteSongs, setPlaylist]);

  const handleRemoveFromFavorites = async (song) => {
    try {
      // Lógica para eliminar de favoritos
      setFavoriteSongs((prev) => {
        const updatedFavorites = prev.filter((s) => s.id !== song.id);
        return updatedFavorites;
      });
      toast.success("Canción eliminada de favoritos");
    } catch (error) {
      toast.error("Error al eliminar de favoritos");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <Skeleton className="h-10 w-48 mb-4" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="text-red-400 text-xl mb-4">Error cargando favoritos</div>
        <button
          className="text-red-300 hover:text-red-400"
          onClick={() => window.location.reload()}
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="p-6 flex flex-col gap-4 items-start">
        <div className="flex items-center gap-3">
          <div className="text-5xl">
            <Image
              width={500}
              height={500}
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
        <h2 className="text-xl font-semibold mb-4 border-b border-purple-500 pb-2">
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
          <div className="space-y-4">
            {favoriteSongs.map((song) => (
              <PlaylistCard
                key={song.id}
                song={song}
                isPlaying={currentSong?.id === song.id && isPlaying}
                onPlay={() => {
                  try {
                    // Si la playlist actual es diferente, se actualiza a la de favoritos
                    setPlaylist(favoriteSongs);
                    // Luego se reproduce la canción haciendo que la playlist sea la de favoritos
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
