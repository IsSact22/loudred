import React from "react";
import NextSongCard from "../cards/NextSongCard";

const SidebarRight = () => {
  // Datos de la próxima canción (puedes cargarlos dinámicamente desde tu base de datos)
  const nextSong = {
    image: "/assets/image.png",
    title: "Style",
    artist: "Taylor Swift",
  };

  return (
    <div className="flex">
      {/* Sidebar Derecho */}
      <div className="bg-gradient-to-b from-purple-900 to-purple-950 text-white h-screen w-80 fixed right-0 top-0">
        {/* Contenido del sidebar */}
        <div className="flex flex-col mt-10 space-y-4 px-4">
          <h2 className="text-white font-semibold text-xl mb-4">Siguiente en reproducción:</h2>

          {/* Tarjeta de la siguiente canción */}
          <NextSongCard image={nextSong.image} title={nextSong.title} artist={nextSong.artist} />
          <NextSongCard image={nextSong.image} title={nextSong.title} artist={nextSong.artist} />
          <NextSongCard image={nextSong.image} title={nextSong.title} artist={nextSong.artist} />
          
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 ml-0">
        {/* Aquí va el contenido principal de tu aplicación */}
      </div>
    </div>
  );
};

export default SidebarRight;
