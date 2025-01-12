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
  return (

    // Carrusel de canciones
    <Carousel className="flex w-full max-w-3xl mt-4">
      {/* Ajuste del espaciado entre items */}
      <CarouselContent className="-ml-1">
        {songs.map((song) => (
          <CarouselItem key={song.id} className="pl-1 md:basis-1/3 lg:basis-1/4">
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
