import { FaHeart, FaRegHeart } from "react-icons/fa";

const SongCard = ({ songId, userId, image, title, artist, onClick, onFavoriteClick }) => {
  return (
    <div
      onClick={onClick} // Agregar la funcionalidad de clic en toda la tarjeta
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
            onClick={(e) => {
              e.stopPropagation(); // Evitar que el evento se propague al contenedor
              onFavoriteClick(); // Llamar a la función del carrusel
            }}
            className="text-purple-300 hover:text-red-400 transition-colors"
          >
            <FaRegHeart />
          </button>
        </div>
      </div>
    </div>
  );
};


export default SongCard;
