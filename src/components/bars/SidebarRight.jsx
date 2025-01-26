"use client";
import React from "react";
import NextSongCard from "../cards/NextSongCard";
import MusicPlayer from "../MusicPlayer";
import { usePlayerStore } from "@/src/stores/usePlayerStore";

const SidebarRight = () => {
  const { currentPlaylist, currentSong } = usePlayerStore();

  // Obtener las próximas canciones en la cola
  const nextSongs = currentPlaylist
    .slice(
      currentPlaylist.findIndex((song) => song.id === currentSong?.id) + 1
    )
    .slice(0, 2); // Limitar a las próximas 2 canciones

  return (
    <div className="absolute top-0">
      {/* Sidebar Derecho */}
      <div className="bg-gradient-to-b from-purple-900 to-purple-950 text-white h-screen w-80 fixed right-0 top-0">
        {/* Contenido del sidebar */}
        <div className="flex flex-col mt-10 space-y-4 px-4">
          <h2 className="text-white font-semibold text-xl mb-4">
            Siguiente en reproducción:
          </h2>

          {/* Tarjetas de las siguientes canciones */}
          {nextSongs.length > 0 ? (
            nextSongs.map((song, index) => (
              <NextSongCard
                key={song.id} // Asegúrate de que cada tarjeta tenga una 'key' única
                index={index}  // Pasa el index a cada tarjeta
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
