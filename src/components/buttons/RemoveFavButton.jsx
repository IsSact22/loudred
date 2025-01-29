// components/RemoveFavButton.js
"use client";

import React from "react";
import { HiXCircle } from "react-icons/hi"; // Ícono de eliminación
import { toast } from "react-hot-toast";
import { fetcher } from "@/src/services/fetcher";

export function RemoveFavButton({ song, userId, onRemove }) {
  const handleDelete = async () => {
    if (!userId || !song?.id) {
      console.error("Error: userId o songId no definidos.");
      toast.error("Error interno: No se puede eliminar la canción.");
      return;
    }

    try {
      console.log(`Intentando eliminar canción con userId: ${userId}, songId: ${song.id}`);
      const response = await fetcher.delete(`/favourite`, { userId, songId: song.id });

      console.log("Respuesta del servidor:", response);
      onRemove(song);
      toast.success("Canción eliminada de favoritos.");
    } catch (error) {
      console.error("Error al eliminar la canción:", error.response?.data || error.message);
      toast.error("No se pudo eliminar la canción.");
    }
  };

  return (
    <button
      className="flex items-center justify-center p-2  hover:bg-red-700 rounded-full"
      onClick={handleDelete}
      aria-label={`Eliminar ${song.title}`}
    >
      <HiXCircle className="h-6 w-6 text-white" />
    </button>
  );
}
