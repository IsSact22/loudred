// components/SidebarRight.jsx
"use client";
import React, { useEffect } from "react";
import NextSongCard from "../cards/NextSongCard";
import MusicPlayer from "../MusicPlayer";
import { usePlayerStore } from "@/src/stores/playerStore";

const SidebarRight = () => {
  const { currentPlaylist, currentSong } = usePlayerStore();

  // Función para normalizar el ID de la canción
  const getSongId = (song) => song?.songId || song?.id;

  // Obtener el índice usando el identificador normalizado
  const currentIndex = currentPlaylist.findIndex(
    (song) => getSongId(song) === getSongId(currentSong)
  );

  // Generar nextSongs con lógica mejorada
  const nextSongs = React.useMemo(() => {
    if (!currentSong || currentIndex === -1) return [];

    return [
      ...currentPlaylist.slice(currentIndex + 1),
      ...currentPlaylist.slice(0, currentIndex),
    ].slice(0, 2);
  }, [currentPlaylist, currentIndex, currentSong]);

  // Efecto para forzar actualización cuando cambia la canción
  useEffect(() => {
    // Lógica adicional si es necesaria
  }, [currentPlaylist, currentSong, currentIndex]);

  return (
    <div className="absolute top-0">
      <div className="bg-gradient-to-b from-purple-900 to-purple-950 text-white h-screen w-80 fixed right-0 top-0">
        <div className="flex flex-col mt-10 space-y-4 px-4">
          <h2 className="text-white font-semibold text-xl mb-4">
            Siguiente en reproducción:
          </h2>

          {nextSongs.length > 0 ? (
            nextSongs.map((song, index) => (
              <NextSongCard
                key={`${getSongId(song)}-${index}`}
                image={song.image || "/placeholder-song.jpg"}
                title={song.title}
                artist={song.artist || "Artista desconocido"}
              />
            ))
          ) : (
            <p className="text-gray-300">No hay más canciones en la cola.</p>
          )}
        </div>

        <MusicPlayer />
      </div>
    </div>
  );
};

export default SidebarRight;
