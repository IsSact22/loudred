import React from "react";

export default function NextSongCard({ image, title, username}) {
  return (
    <div className="flex items-center p-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg shadow-lg shadow-blue-500/50">
      {/* Imagen de la canción */}
      <div className="flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-16 h-16 rounded-full object-cover shadow-md"
        />
      </div>

      {/* Información de la canción */}
      <div className="ml-4">
        <h3 className="text-white font-semibold text-lg truncate">{title}</h3>
        <p className="text-white/80 text-sm truncate">{username}</p>
      </div>
    </div>
  );
}
