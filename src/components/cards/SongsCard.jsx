import FavButton from "../buttons/FavButton";

const SongCard = ({ image, title, artist, onClick, songId }) => {
  return (
    <div
      onClick={onClick} // Agregar la funcionalidad de clic en toda la tarjeta
      className="w-40  bg-slate-900 hover:bg-slate-800 rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105"
    >
      {/* Imagen de la canción */}
      <img src={image} alt={title} className="w-full h-40 object-cover" />

      {/* Contenido del card */}
      <div className="p-2 text-white">
        <h3 className="text-sm font-semibold truncate">{title}</h3>
        <p className="text-xs text-purple-300 truncate">{artist}</p>

        {/* Ícono de "agregar a favoritos" */}
        <div className="flex justify-end mt-2">
          <FavButton songId={songId} /> {/* Usamos el nuevo componente aquí */}
        </div>
      </div>
    </div>
  );
};

export default SongCard;
