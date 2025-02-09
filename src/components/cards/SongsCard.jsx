import FavButton from "../buttons/FavButton";
import Image from "next/image";

const SongCard = ({ image, title, artist, onClick, songId, className }) => {
  return (
    <div
      onClick={onClick} // Agregar la funcionalidad de clic en toda la tarjeta
      className={`${className} w-40 bg-slate-900 hover:bg-slate-800 rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105`}
    >
      {/* Imagen de la canción */}
      <Image
       width={500}
       height={500}
       src={image}
       alt={title} 
       className="w-full h-40 object-cover" />

      {/* Contenido del card */}
      <div className="p-2 text-white">
        <h3 className="text-sm font-semibold truncate">{title}</h3>
        <p className="text-xs text-purple-300 mt-1 truncate">{artist}</p>

        {/* Ícono de "agregar a favoritos" */}
        <div className="flex justify-end mt-2">
          <FavButton songId={songId} />
        </div>
      </div>
    </div>
  );
};

export default SongCard;
