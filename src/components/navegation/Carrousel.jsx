import * as React from "react";
import SongCard from "../cards/SongsCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { HiChevronLeft } from "react-icons/hi";


export function CarouselSongs() {
  const songs = [
    {
      id: 1,
      image: "/assets/image.png", 
      title: "Song Title 1",
      artist: "Artist 1",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/150",
      title: "Song Title 2",
      artist: "Artist 2",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/150",
      title: "Song Title 3",
      artist: "Artist 3",
    },
    {
      id: 4,
      image: "https://via.placeholder.com/150",
      title: "Song Title 4",
      artist: "Artist 4",
    },
    {
      id: 5,
      image: "https://via.placeholder.com/150",
      title: "Song Title 5",
      artist: "Artist 5",
    },
  ];

  const handleFavorite = (title, isFavorited) => {
    console.log(`${title} fue ${isFavorited ? "añadido a favoritos" : "removido de favoritos"}`);
  };

  return (
    <Carousel className="w-full max-w-lg">
      <CarouselContent className="-ml-1">
        {songs.map((song) => (
          <CarouselItem key={song.id} className="pl-1 md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <SongCard
                image={song.image}
                title={song.title}
                artist={song.artist}
                onFavorite={handleFavorite}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
