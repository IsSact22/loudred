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
import { usePlayerStore } from "@/src/stores/usePlayerStore";
import { useSession } from "next-auth/react"; // Importamos useSession

const SongCarousel = ({ songs }) => {
  const { data: session } = useSession();
  const playSong = usePlayerStore((state) => state.playSong);

  if (!songs || !songs.length) {
    return <div>No hay canciones disponibles</div>;
  }

  // Ordenar canciones
  const sortedSongs = [...songs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handlePlay = (song) => {
    playSong(song, sortedSongs); // Reproducir canción
  };

  return (
    <Carousel className="flex w-full max-w-6xl mt-4">
      <CarouselContent className="-ml-2">
        {sortedSongs.map((song, index) => (
          <CarouselItem
            key={`${song.id}-${index}`}
            className="pl-6 md:basis-1/5 lg:basis-1/6 space-x-4"
          >
            <SongCard
              image={song.image}
              title={song.title}
              artist={song.artist}
              songId={song.id} // Pasamos el songId
              onClick={() => handlePlay(song)} // Reproducir la canción al hacer clic
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-slate-50" />
      <CarouselNext className="bg-slate-50" />
    </Carousel>
  );
};

export default SongCarousel;
