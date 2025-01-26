import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const SongCard = ({ image, title, artist, onFavorite, onClick }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = (event) => {
    event.stopPropagation(); // Evitar que el evento de clic se propague al contenedor clickeable
    setIsFavorited(!isFavorited);
    if (onFavorite) {
      onFavorite(title, !isFavorited);
    }
  };

  return (
    <div
      onClick={onClick} // Agregamos la funcionalidad de clic en toda la tarjeta
      className="w-40 mr-20 bg-slate-900 hover:bg-slate-800 rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105"
    >
      {/* Imagen de la canción */}
      <img src={image} alt={title} className="w-full h-40 object-cover" />

      {/* Contenido del card */}
      <div className="p-2 text-white">
        <h3 className="text-sm font-semibold truncate">{title}</h3>
        <p className="text-xs text-purple-300 truncate">{artist}</p>

        {/* Ícono de "me gusta" */}
        <div className="flex justify-end mt-2">
          <button
            onClick={handleFavoriteClick}
            className={`${
              isFavorited ? "text-red-500" : "text-purple-300"
            } hover:text-red-400 transition-colors`}
          >
            {isFavorited ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
