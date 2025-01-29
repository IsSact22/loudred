"use client";
import React, { useEffect } from "react";
import NextSongCard from "../cards/NextSongCard";
import MusicPlayer from "../MusicPlayer";
import { usePlayerStore } from "@/src/stores/usePlayerStore";

const SidebarRight = () => {
  const { currentPlaylist, currentSong } = usePlayerStore();
  
  // Obtener el índice de la canción actual en la playlist
  const currentIndex = currentPlaylist.findIndex((song) => song.id === currentSong?.id);

  // Filtrar y obtener las siguientes canciones sin afectar la canción actual
  const nextSongs = currentPlaylist
    .slice(currentIndex + 1) // Tomar las canciones después de la actual
    .concat(currentPlaylist.slice(0, currentIndex)) // Para hacer un loop infinito
    .slice(0, 2); // Solo mostrar las siguientes 2 canciones

  // Asegurarnos de que la cola de canciones se actualice correctamente al cambiar el modo de aleatorio
  useEffect(() => {
    // Aquí podrías agregar algo como un efecto de actualización cuando el estado de la lista cambia
    // Esto es solo un ejemplo de cómo podrías reaccionar a cambios en el estado
  }, [currentPlaylist, currentSong]);

  return (
    <div className="absolute top-0">
      <div className="bg-gradient-to-b from-purple-900 to-purple-950 text-white h-screen w-80 fixed right-0 top-0">
        <div className="flex flex-col mt-10 space-y-4 px-4">
          <h2 className="text-white font-semibold text-xl mb-4">
            Siguiente en reproducción:
          </h2>

          {/* Tarjetas de las siguientes canciones */}
          {nextSongs.length > 0 ? (
            nextSongs.map((song, index) => (
              <NextSongCard
                key={`${song.id}-${index}`}
                index={index}
                image={song.image}
                title={song.title}
                artist={song.artist}
              />
            ))
          ) : (
            <p className="text-gray-300">No hay más canciones en la cola.</p>
          )}
        </div>

        {/* Reproductor principal */}
        <MusicPlayer />
      </div>
    </div>
  );
};

export default SidebarRight;
