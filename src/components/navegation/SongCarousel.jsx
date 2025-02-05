import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SongCard from "../cards/SongsCard";
import { usePlayerActions, usePlayerStore } from "@/src/stores/playerStore";

const SongCarousel = ({ songs }) => {
  const { playSong } = usePlayerActions();
  const currentSong = usePlayerStore((state) => state.currentSong);
  const currentPlaylist = usePlayerStore((state) => state.currentPlaylist);

  if (!songs?.length) {
    return (
      <div className="text-gray-400 p-4">No hay canciones disponibles</div>
    );
  }

  const sortedSongs = [...songs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handlePlay = (song) => {
    // Si la playlist actual es diferente, usar sortedSongs como nueva playlist
    const isDifferentPlaylist = !currentPlaylist.some((s) => s.id === song.id);
    playSong(song, isDifferentPlaylist ? sortedSongs : currentPlaylist);
  };

  return (
    <Carousel className="flex w-full max-w-6xl mt-4">
      <CarouselContent className="flex gap-4 py-2 -ml-2">
        {sortedSongs.map((song) => (
          <CarouselItem
            key={song.id} // Mejor usar solo el ID único
            className="md:basis-1/5 lg:basis-1/6 flex-1"
          >
            <SongCard
              className={
                currentSong?.id === song.id
                  ? "shadow-lg shadow-indigo-500/70"
                  : ""
              }
              image={song.image}
              title={song.title}
              artist={song.username}
              songId={song.id}
              isActive={currentSong?.id === song.id}
              onClick={() => handlePlay(song)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-slate-50 hover:bg-slate-100" />
      <CarouselNext className="bg-slate-50 hover:bg-slate-100" />
    </Carousel>
  );
};

export default SongCarousel;
