"use client";

import { useEffect, useState } from "react";
import { usePlayerStore } from "@/src/stores/usePlayerStore";
import { PlaylistCard } from "@/src/components/cards/PlaylistCardProfile";
import { useData } from "@/src/hooks/useData";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function ProfileUserPage({ params }) {
  const { id } = params;
  const [user, setUser] = useState(null);
  const [userSongs, setUserSongs] = useState([]);
  const { playSong, setPlaylist } = usePlayerStore();
  const { data: userData, isLoading: userLoading, error: userError } = useData(`/admin/users/${id}`);

  useEffect(() => {
    if (userData) {
      setUser(userData);
      setUserSongs(userData.songs || []);
    }
  }, [userData]);

  if (userLoading) return <div className="m-4">Cargando perfil...</div>;
  if (userError || !user) {
    return <div className="m-4 text-red-500">Error al cargar el perfil.</div>;
  }

  //eliminar
  const handleRemoveSong = async (song) => {
    try {
      const response = await fetch(`/api/songs/${song.songId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar la canción.");

      setUserSongs((prev) => prev.filter((s) => s.songId !== song.songId));
      toast.success("Canción eliminada con éxito.");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar la canción.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white mr-10">
      <header className="p-6 flex flex-col gap-4 items-start">
        <div className="flex items-center gap-3">
          <Image
            width={200}
            height={200}
            alt="avatar"
            className="rounded-full object-cover"
            src={user.avatar || "/avatars/default-avatar.jpg"}
          />
          <div className="flex flex-col items-start">
            <h1 className="text-7xl font-bold">
              {user.name} {user.lastname}
            </h1>
            <h3 className="font-medium text-xl text-red-400">@{user.username}</h3>
          </div>
        </div>
      </header>

      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4 border-b border-purple-500 mr-10 pb-2">
          Canciones de {user.username}
        </h2>
        <div>
          {userSongs.length === 0 ? (
            <p>
              Este usuario aún no ha subido canciones.
            </p>
          ) : (
            <div className="space-y-4 mr-10">
              {userSongs.map((song) => (
                <PlaylistCard
                  key={song.songId}
                  song={song}
                  onPlay={() => {
                    setPlaylist(userSongs);
                    playSong(song, userSongs);
                  }}
                  onConfirmDelete={handleRemoveSong}
                  deleteActionLabel="Eliminar canción"
                  deleteConfirmationMessage="¿Seguro que deseas eliminar esta canción?"
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
