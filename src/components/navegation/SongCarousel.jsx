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

const SongCarousel = ({ songs }) => {
  const playSong = usePlayerStore((state) => state.playSong); // Método para reproducir una canción

  if (!songs || !songs.length) {
    return <div>No hay canciones disponibles</div>;
  }

  // Ordenar las canciones por fecha de creación (de más reciente a más antigua)
  const sortedSongs = [...songs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handlePlay = (song) => {
    playSong(song, sortedSongs); // Reproduce la canción seleccionada y pasa la playlist completa
  };

  return (
    <Carousel className="flex w-full max-w-6xl mt-4">
      <CarouselContent className="-ml-2">
        {sortedSongs.map((song, index) => (
          <CarouselItem
            key={`${song.id}-${index}`}
            className="pl-6 md:basis-1/5 lg:basis-1/6"
          >
            <SongCard
              image={song.image}
              title={song.title}
              artist={song.artist}
              onFavorite={(title, isFavorited) =>
                console.log(`Song: ${title}, Favorited: ${isFavorited}`)
              }
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
