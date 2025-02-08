"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "react-hot-toast";
import { useData } from "@/src/hooks/useData";
import { useState, useEffect } from "react";
import { usePlayerActions, usePlayerStore } from "@/src/stores/playerStore";
import { Play } from "lucide-react";

export default function VerificationPage() {
  const { data = [], createData, deleteData } = useData("/songs");
  const songs = data.songs || [];

  const [pendingSongs, setPendingSongs] = useState([]);

  // Hooks del reproductor
  const { playSong, setPlaylist } = usePlayerActions();
  const { currentSong, isPlaying } = usePlayerStore();

  useEffect(() => {
    if (songs.length > 0) {
      const filtered = songs.filter(
        (song) => song.validate === false || song.validate === 0
      );
      setPendingSongs(filtered);
    }
  }, [songs]);

  // Configurar la playlist con las canciones en verificación
  useEffect(() => {
    setPlaylist(pendingSongs);
  }, [pendingSongs, setPlaylist]);

  const handleApprove = async (song) => {
    const payload = { ...song, validate: true };
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });
    await createData(formData, song.id);
    toast.success("Canción aprobada exitosamente");
  };

  const handleReject = async (song) => {
    await deleteData(song.id);
    toast.success("Canción rechazada y eliminada");
  };

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Título", accessor: "title" },
    { header: "Categoría", accessor: "categoryName" },
    { header: "Artista", accessor: "username" },
  ];

  const actions = (song) => (
    <div className="flex space-x-2 items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          try {
            setPlaylist(pendingSongs);
            playSong(song, pendingSongs);
          } catch (error) {
            toast.error("Error al reproducir: " + error.message);
          }
        }}
        aria-label={`Reproducir ${song.title}`}
      >
        <Play className="h-5 w-5 text-purple-500" />
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleApprove(song)}>
        Aprobar
      </Button>
      <Button variant="destructive" size="sm" onClick={() => handleReject(song)}>
        Rechazar
      </Button>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Verificaciones de Canciones</h1>
      <DataTable data={pendingSongs} columns={columns} actions={actions} />
    </div>
  );
}
