// components/carousels/SongCarousel.js
import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SongCard from "../cards/SongsCard";
import { usePlayerActions, usePlayerStore } from "@/src/stores/playerStore"; // Cambiar a usePlayerActions

const SongCarousel = ({ songs }) => {
  const { playSong } = usePlayerActions(); // Usar acciones del store
  const currentSong = usePlayerStore((state) => state.currentSong); // Opcional: para resaltar la canción actual

  if (!songs || !songs.length) {
    return (
      <div className="text-gray-400 p-4">No hay canciones disponibles</div>
    );
  }

  // Ordenar canciones
  const sortedSongs = [...songs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handlePlay = (song) => {
    playSong(song, sortedSongs); // Usar la acción del store
  };

  return (
    <Carousel className="flex w-full max-w-6xl mt-4">
      <CarouselContent className="py-2 -ml-2">
        {sortedSongs.map((song, index) => (
          <CarouselItem
            key={`${song.id}-${index}`}
            className="pl-6 md:basis-1/5 lg:basis-1/6 space-x-4"
          >
            <SongCard
              className={`${
                currentSong?.id === song.id ? "shadow-lg shadow-indigo-500/50" : ""
              }`}
              image={song.image}
              title={song.title}
              artist={song.artist}
              songId={song.id}
              isPlaying={currentSong?.id === song.id} // Resaltar canción actual
              onClick={() => handlePlay(song)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-slate-50 hover:bg-slate-200" />
      <CarouselNext className="bg-slate-50 hover:bg-slate-200" />
    </Carousel>
  );
};

export default SongCarousel;
