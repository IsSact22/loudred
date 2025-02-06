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
      const response = await fetcher.delete(`/favourite`, { userId, songId: song.id });
      onRemove(song);
      // toast.success("Canción eliminada de favoritos.");
    } catch (error) {
      console.error("Error al eliminar la canción:", error.response?.data || error.message);
      // toast.error("No se pudo eliminar la canción.");
    }
  };

  const confirmDelete = () => {
    toast((t) => (
      <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md text-gray-900">
        <span className="text-lg mb-3">¿Seguro que deseas eliminar esta canción de favoritos?</span>
        <div className="flex gap-4">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              handleDelete(); // Ejecuta la eliminación si el usuario confirma
            }}
            className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
          >
            Sí
          </button>
          <button
            onClick={() => toast.dismiss(t.id)} // Solo cierra el toast si el usuario cancela
            className="bg-gray-500 text-white py-1 px-4 rounded hover:bg-gray-600"
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  return (
    <button
      className="flex items-center justify-center p-2 hover:bg-red-700 rounded-full"
      onClick={confirmDelete} // Llamamos a confirmDelete en lugar de handleDelete directamente
      aria-label={`Eliminar ${song.title}`}
    >
      <HiXCircle className="h-6 w-6 text-white" />
    </button>
  );
}
