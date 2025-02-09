// PlaylistCard
"use client";

import React from "react";
import { Play } from "lucide-react";
import { RemoveFavButton } from "../buttons/RemoveFavButton";
import Image from "next/image";

export function PlaylistCard({ song, onPlay, userId, onRemove }) {
  return (
    <div className="flex items-center p-4 bg-gray-800 rounded-lg shadow-md text-white gap-4">
      {/* Mostrar el botón de eliminar solo en la vista de favoritos */}

      {/* Imagen de la portada */}
      <Image
        width={500}
        height={500}
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
      {userId && (
        <RemoveFavButton song={song} userId={userId} onRemove={onRemove} />
      )}
    </div>
  );
}
