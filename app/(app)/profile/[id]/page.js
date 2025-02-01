"use client";

import React, { useEffect, useState } from "react";
import { usePlayerStore, usePlayerActions } from "@/src/stores/playerStore";
import { PlaylistCard } from "@/src/components/cards/PlaylistCardProfile";
import { useData } from "@/src/hooks/useData";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";

export default function ProfileUserPage({ params }) {
  const { id } = React.use(params);
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [userSongs, setUserSongs] = useState([]);

  // Usar acciones del store
  const { playSong, setPlaylist } = usePlayerActions();
  const { currentSong, isPlaying } = usePlayerStore();

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useData(`/admin/users/${id}`);

  useEffect(() => {
    if (userData) {
      setUser(userData);
      setUserSongs(userData.songs || []);
      setPlaylist(userData.songs || []); // Actualizar playlist en el store
    }
  }, [userData, setPlaylist]);

  const handleRemoveSong = async (song) => {
    if (!session?.user?.isAdmin) {
      toast.error("No tienes permisos para esta acción");
      return;
    }

    try {
      const response = await fetch(`/api/songs/${song.songId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      if (!response.ok) throw new Error(await response.text());

      setUserSongs((prev) => prev.filter((s) => s.songId !== song.songId));
      toast.success("Canción eliminada correctamente");
    } catch (error) {
      console.error("Error eliminando canción:", error);
      toast.error(error.message || "Error al eliminar la canción");
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white mr-10 p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="w-40 h-40 rounded-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <Skeleton className="h-8 w-64 mt-6" />
        <div className="space-y-4 mt-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="text-red-400 text-xl mb-4">Error cargando perfil</div>
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
    <div className="min-h-screen bg-slate-950 text-white mr-10">
      <header className="p-6 flex flex-col gap-4 items-start">
        <div className="flex items-center gap-3">
          <Image
            width={200}
            height={200}
            alt="avatar"
            className="rounded-full object-cover border-2 border-red-500"
            src={user.avatar || "/avatars/default-avatar.jpg"}
            onError={(e) => {
              e.target.src = "/avatars/default-avatar.jpg";
            }}
          />
          <div className="flex flex-col items-start">
            <h1 className="text-7xl font-bold">
              {user.name} {user.lastname}
            </h1>
            <h3 className="font-medium text-xl text-red-400">
              @{user.username}
            </h3>
          </div>
        </div>
      </header>

      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4 border-b border-purple-500 mr-10 pb-2">
          Canciones de {user.username} ({userSongs.length})
        </h2>

        {userSongs.length === 0 ? (
          <div className="text-gray-400">
            <p>Este usuario aún no ha subido canciones</p>
          </div>
        ) : (
          <div className="space-y-4 mr-10">
            {userSongs.map((song) => (
              <PlaylistCard
                key={song.songId}
                song={{
                  ...song,
                  id: song.songId, // Normalizar el identificador
                }}
                onPlay={() => {
                  const normalizedSongs = userSongs.map((s) => ({
                    ...s,
                    id: s.songId,
                  }));
                  setPlaylist(normalizedSongs);
                  playSong({ ...song, id: song.songId }, normalizedSongs);
                }}
                onConfirmDelete={
                  session?.user?.isAdmin ? handleRemoveSong : null
                }
                deleteActionLabel="Eliminar canción (Admin)"
                deleteConfirmationMessage="¿Estás seguro de eliminar esta canción? Esta acción es irreversible."
                showDelete={session?.user?.isAdmin}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
