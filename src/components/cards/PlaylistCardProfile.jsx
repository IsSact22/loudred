// PlaylistCard
"use client";

import React from "react";
import { Play } from "lucide-react";
import { HiTrash } from "react-icons/hi";
import { toast } from "react-hot-toast";

export function PlaylistCard({ song, onPlay, onConfirmDelete, deleteActionLabel, deleteConfirmationMessage, isOwner }) {
  const handleDelete = () => {
    toast((t) => (
      <div className="flex flex-col items-center p-6 bg-white rounded-lg text-center">
        <span className="text-xl mb-4">{deleteConfirmationMessage || "¿Seguro que deseas eliminar esta canción?"}</span>
        <div className="flex gap-4">
          <button
            onClick={() => {
              onConfirmDelete(song);
              toast.dismiss(t.id);
            }}
            className="bg-red-500 text-white py-1 px-4 rounded"
          >
            Sí
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-500 text-white py-1 px-4 rounded"
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex items-center p-4 bg-gray-800 rounded-lg shadow-md text-white gap-4">
      {/* Imagen de la portada */}
      <img
        src={song.image || "/placeholder.svg"}
        alt={`Portada de ${song.title}`}
        className="w-16 h-16 rounded object-cover"
      />

      {/* Información de la canción */}
      <div className="flex-1">
        <h2 className="text-lg font-bold">{song.title}</h2>
        <p className="text-sm text-gray-400">{song.artist}</p>
      </div>

      {/* Botón para reproducir */}
      <button
        className="flex items-center justify-center p-2 bg-purple-600 hover:bg-purple-700 rounded-full"
        onClick={() => onPlay(song)}
        aria-label={`Reproducir ${song.title}`}
      >
        <Play className="h-5 w-5 text-white" />
      </button>

      {/* Solo mostrar el botón de basura si es el propietario */}
      {isOwner && (
        <button
          className="flex items-center justify-center p-2 bg-red-600 hover:bg-red-700 rounded-full"
          onClick={handleDelete}
          aria-label={deleteActionLabel || `Eliminar ${song.title}`}
        >
          <HiTrash className="h-5 w-5 text-white" />
        </button>
      )}
    </div>
  );
}
