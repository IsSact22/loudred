// ProfilePage
"use client";

import { PlaylistCard } from "@/src/components/cards/PlaylistCardProfile";
import { useSession } from "next-auth/react";
import { useData } from "@/src/hooks/useData";
import React, { useEffect, useState } from "react";
import { usePlayerStore } from "@/src/stores/usePlayerStore";
import Link from "next/link";
import { toast } from "react-hot-toast"; // Asegúrate de importar toast si no lo has hecho
import Image from 'next/image'

export default function ProfilePage() {
  const { data: session } = useSession();
  const [userSongs, setUserSongs] = useState([]);
  const username = session?.user?.username || "Artista"; // Obtiene el nombre del usuario
  const { data: songData = {}, isLoading: loadingSongs, error: errorSongs } = useData("/songs");

  const { playSong, setPlaylist } = usePlayerStore();

  // Función para eliminar la canción por completo
  const handleRemoveSong = async (song) => {
    if (!session?.user?.id || !song?.id) {
      console.error("Error: userId o songId no definidos.");
      toast.error("Error interno: No se puede eliminar la canción.");
      return;
    }

    try {
      // Realiza la solicitud DELETE a tu backend para eliminar la canción
      const response = await fetch(`/api/songs/${song.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar la canción.");
      }

      // Actualiza el estado después de la eliminación
      setUserSongs((prev) => prev.filter((s) => s.id !== song.id)); 
      toast.success("Canción eliminada con éxito.");
    } catch (error) {
      console.error("Error al eliminar la canción:", error);
      toast.error("No se pudo eliminar la canción.");
    }
  };

  useEffect(() => {
    if (session?.user?.id && songData?.songs) {
      const userSongs = songData.songs.filter((song) => song.userId === session.user.id);
      setUserSongs(userSongs);
    }
  }, [session, songData]);

  if (loadingSongs) {
    return <div className="m-4">Cargando canciones...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white mr-10">
      <header className="p-6 flex flex-col gap-4 items-start">
        <div className="flex items-center gap-3">
          <div className="text-5xl">
            <Image
              width={200}
              height={200}
              alt="avatar"
              className="rounded-full object-cover"
              src={session?.user?.avatar ? session.user.avatar : '/avatars/default-avatar.jpg'}
              />
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-7xl font-bold">Mi Perfil</h1>
            <h3 className="font-medium text-xl text-red-400">{username}</h3>
          </div>
        </div>
      </header>

      {/* Tabla de canciones */}
      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4 border-b border-purple-500 mr-10 pb-2">
          Mis Canciones
        </h2>
        <div>
          {userSongs.length === 0 ? (
            <p>No has subido una canción aún
              <Link href="/upload" className="text-red-400 ml-1">
                ¡Sube una!
              </Link> 
            </p>
          ) : (
            <div className="space-y-4 mr-10">
              {userSongs.map((song, index) => (
                <PlaylistCard
                  key={song.id || index}
                  song={song}
                  onPlay={() => {
                    setPlaylist(userSongs);
                    playSong(song, userSongs);
                  }}
                  onConfirmDelete={handleRemoveSong} // Aquí pasas la nueva función para eliminar la canción
                  deleteActionLabel="Eliminar canción"
                  deleteConfirmationMessage="¿Seguro que deseas eliminar esta canción?"
                  isOwner={session?.user?.id === song.userId} // Solo mostrar el botón si el usuario es el propietario
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
