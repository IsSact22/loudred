import Image from "next/image";

const UserCard = ({ avatar, username, onClick }) => {
    return (
      <div
        onClick={onClick} // Hace que toda la tarjeta sea clickeable
        className="flex flex-col m-5 items-center cursor-pointer transition-transform hover:scale-105 py-2"
      >
        {/* Imagen de perfil */}
        <div className="w-[180px] h-[180px] rounded-full overflow-hidden border-2 border-gray-700 shadow-lg shadow-indigo-500/50">
          <Image
            src={avatar}
            alt={username}
            width={500} // Tamaño fijo para todas las imágenes
            height={500}
            className="object-cover w-full h-full"
          />
        </div>
  
        {/* Nombre de usuario */}
        <p className="mt-4 text-sm text-white font-semibold truncate">{username}</p>
      </div>
    );
  };
  
  export default UserCard;
  