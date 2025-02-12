"use client";

import { PlaylistCard } from "@/src/components/cards/PlaylistCardProfile";
import { useSession } from "next-auth/react";
import { useData } from "@/src/hooks/useData";
import React, { useEffect, useState } from "react";
import { usePlayerStore, usePlayerActions } from "@/src/stores/playerStore";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [userSongs, setUserSongs] = useState([]);
  const username = session?.user?.username || "Artista";
  const {
    data: songData = {},
    isLoading: loadingSongs,
    error: errorSongs,
  } = useData("/songs?validate=1");

  // Usar acciones del store
  const { playSong, setPlaylist } = usePlayerActions();
  const { currentSong, isPlaying } = usePlayerStore();

  const baseFileUrl = "/api/uploads";
  const avatarUrl =
    session?.user?.avatar && session.user.avatar.startsWith("/uploads")
      ? `${baseFileUrl}${session.user.avatar.replace(/^\/uploads/, "")}`
      : session?.user?.avatar || "/avatars/default-avatar.jpg";

  useEffect(() => {
    if (session?.user?.id && songData?.songs) {
      const filteredSongs = songData.songs.filter(
        (song) => song.userId === session.user.id
      );
      setUserSongs(filteredSongs);
      // NOTA: No se setea la playlist acá para forzar el cambio solo al hacer click
      // setPlaylist(filteredSongs);
    }
  }, [session, songData, setPlaylist]);

  const handleRemoveSong = async (song) => {
    if (!session?.user?.id || !song?.id) {
      toast.error("Error de autenticación o canción no válida");
      return;
    }
  
    try {
      const response = await fetch(`/api/songs/${song.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
  
      if (!response.ok) throw new Error("Error en la respuesta del servidor");
  
      setUserSongs((prev) => prev.filter((s) => s.id !== song.id));
      
      toast.success("Canción eliminada de la playlist");
    } catch (error) {
      console.error("Error eliminando canción:", error);
      toast.error(error.message || "Error al eliminar la canción");
    }
  };
  
  // Llamamos `setPlaylist` después de que `userSongs` cambie
  useEffect(() => {
    setPlaylist(userSongs);
  }, [userSongs, setPlaylist]);

  if (loadingSongs) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <Skeleton className="h-10 w-48 mb-4" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="p-6 flex flex-col gap-4 items-start">
        <div className="flex items-center gap-3">
          <div className="w-[200px] h-[200px] overflow-hidden">
            <Image
              width={500}
              height={500}
              alt="avatar"
              className="rounded-full w-full h-full object-cover border-2 border-red-500"
              src={avatarUrl}
            />
          </div>

          <div className="flex flex-col items-start">
            <h1 className="text-7xl font-bold">Mi Perfil</h1>
            <h3 className="font-medium text-xl text-red-400">{username}</h3>
          </div>
        </div>
      </header>

      <main className="p-6">
      <h2 className="text-xl font-semibold mb-4 border-b border-purple-500 pb-2 flex items-center">
          Mis canciones
          <p className="text-red-400 ml-2">{userSongs.length}</p>
        </h2>

        {userSongs.length === 0 ? (
          <div className="text-gray-400">
            <p>No has subido ninguna canción aún</p>
            <Link
              href="/upload"
              className="text-red-400 hover:text-red-300 mt-2 inline-block transition-colors"
            >
              ¡Sube tu primera canción!
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userSongs.map((song) => (
              <PlaylistCard
                key={song.id}
                song={song}
                isPlaying={currentSong?.id === song.id && isPlaying}
                onPlay={() => {
                  try {
                    // Actualiza la playlist del store a la lista de canciones del perfil
                    setPlaylist(userSongs);
                    // Reproduce la canción usando la playlist actualizada
                    playSong(song, userSongs);
                  } catch (error) {
                    toast.error("Error al reproducir: " + error.message);
                  }
                }}
                onConfirmDelete={handleRemoveSong}
                deleteActionLabel="Eliminar permanentemente"
                deleteConfirmationMessage="¿Estás seguro de eliminar esta canción? Esta acción no se puede deshacer."
                isOwner={session?.user?.id === song.userId}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
