"use client";

import React from "react";
import { HiXCircle } from "react-icons/hi"; // Ícono de eliminación
import { toast } from "react-hot-toast";
import { useData } from "@/src/hooks/useData"; // Importamos useData

export function RemoveFavButton({ song, userId, onRemove }) {

  // Configurar useData solo si userId y songId existen
  const { deleteData, isMutating } = useData(
    userId && song?.id ? `/favourite?userId=${userId}&songId=${song.id}` : null
  );

  const handleDelete = async () => {
    if (!userId || !song?.id) {
      console.error("Error: userId o songId no definidos.");
      toast.error("Error interno: No se puede eliminar la canción.");
      return;
    }

    try {
      console.log("Eliminando canción:", song);
      await deleteData(); // Llamamos a deleteData sin argumentos, ya que la URL ya tiene los parámetros
      onRemove(song); // Eliminamos la canción de la lista de favoritos en la UI
      toast.success("Canción eliminada de favoritos");
    } catch (error) {
      console.error("Error al eliminar la canción:", error);
      toast.error("No se pudo eliminar la canción.");
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
              handleDelete();
            }}
            className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
            disabled={isMutating} // Deshabilita el botón mientras se elimina
          >
            Sí
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
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
      onClick={confirmDelete}
      aria-label={`Eliminar ${song.title}`}
      disabled={isMutating} // Deshabilitar el botón si la mutación está en curso
    >
      <HiXCircle className="h-6 w-6 text-white" />
    </button>
  );
}
