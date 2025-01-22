import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SongCard from "../cards/SongsCard";

const SongCarousel = ({ songs }) => {
  if (!songs || !songs.length) {
    return <div>No hay canciones disponibles</div>;
  }

  return (
    // Carrusel de canciones
    <Carousel className="flex w-full max-w-6xl mt-4">
      {/* Ajuste del espaciado entre items */}
      <CarouselContent className="-ml-2">
        {songs.map((song, index) => (
          <CarouselItem
            key={`${song.id}-${index}`}
            className="pl-2 md:basis-1/5 lg:basis-1/6"
          >
            <div>
              <SongCard
                image={song.image}
                title={song.title}
                artist={song.artist}
                onFavorite={(title, isFavorited) =>
                  console.log(`Song: ${title}, Favorited: ${isFavorited}`)
                }
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-slate-50" />
      <CarouselNext className="bg-slate-50" />
    </Carousel>
  );
};

export default SongCarousel;
