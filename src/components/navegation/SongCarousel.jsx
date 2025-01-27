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
import { useData } from "@/src/hooks/useData"; // Usamos useData
import toast from "react-hot-toast";

const SongCarousel = ({ songs }) => {
  // Obtener la sesión actual
  const { data: session } = useSession();
  const playSong = usePlayerStore((state) => state.playSong);

  // Usamos el hook useData para interactuar con los favoritos
  const { createData } = useData("/favourite", {}, false);

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

  const handleFavoriteClick = async (songId) => {
    if (!session?.user?.id) {
      toast.error("Por favor, inicia sesión para agregar a favoritos.");
      return;
    }

    const payload = {
      userId: session.user.id,
      songId,
    };

    try {
      // Llamada al backend para agregar la canción a favoritos
      await createData(payload);
      toast.success("Canción agregada a favoritos.");
    } catch (error) {
      console.error("Error al manejar favoritos:", error);
      toast.error("Hubo un problema al actualizar favoritos.");
    }
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
              songId={song.id} // Pasamos el songId
              userId={session?.user?.id} // Usamos el userId de la sesión
              onFavoriteClick={() => handleFavoriteClick(song.id)} // Ahora pasamos el songId correctamente
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
