"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "react-hot-toast";
import { useData } from "@/src/hooks/useData";
import { useState, useEffect } from "react";

export default function VerificationPage() {
  const { data = [], updateData, deleteData } = useData("/songs");

  const songs = data.songs || [];

  // Filtrar solo las canciones que tienen validate en false o 0
  const [pendingSongs, setPendingSongs] = useState([]);

  useEffect(() => {
    if (songs.length > 0) {
      const filtered = songs.filter(
        (song) => song.validate === false || song.validate === 0
      );
      setPendingSongs(filtered);
    }
  }, [songs]);

  // Aprobar canción: se actualiza el campo validate a true usando updateData con FormData
  const handleApprove = async (song) => {
    const payload = { ...song, validate: true };
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });
    await updateData(formData, song.id);
    toast.success("Canción aprobada exitosamente");
  };

  // Rechazar canción: se elimina la canción
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
    <div className="flex space-x-2">
      <Button variant="outline" size="sm" onClick={() => handleApprove(song)}>
        Aprobar
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => handleReject(song)}
      >
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
