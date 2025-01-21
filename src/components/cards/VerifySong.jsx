"use client";

import React from "react";

export function verifySong({ song, onDelete, onValidate }) {
  return (
    <div className="p-4 bg-gray-800 rounded shadow text-white">
      {/* Título de la canción */}
      <h2 className="text-xl font-bold">{song.title}</h2>

      {/* Información adicional */}
      <p>Categoría: {song.categoryName || "Sin categoría"}</p>
      <p>Subido por usuario ID: {song.userId}</p>
      <p>Fecha de creación: {new Date(song.createdAt).toLocaleDateString()}</p>
      <p>Validado: {song.validate ? "Sí" : "No"}</p>

      {/* Imagen de la canción (si existe) */}
      {song.image && (
        <div className="mt-4">
          <img
            src={`/uploads/images/${song.image}`}
            alt={`Imagen de ${song.title}`}
            className="w-full h-auto rounded"
          />
        </div>
      )}

      {/* Música adjunta (si existe) */}
      {song.music && (
        <div className="mt-4">
          <audio controls>
            <source src={`/uploads/music/${song.music}`} type="audio/mpeg" />
            Tu navegador no soporta el reproductor de audio.
          </audio>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex space-x-2 mt-4">
        <button
          className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
          onClick={() => onDelete(song.songId)}
        >
          Eliminar
        </button>

        {/* Mostrar botón de validación solo si no está validada */}
        {!song.validate && (
          <button
            className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded"
            onClick={() => onValidate(song.songId)}
          >
            Validar
          </button>
        )}
      </div>
    </div>
  );
}
