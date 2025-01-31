import Image from "next/image";

const UserCard = ({ avatar, username, onClick }) => {
    return (
      <div
        onClick={onClick} // Hace que toda la tarjeta sea clickeable
        className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
      >
        {/* Imagen de perfil */}
        <Image
          src={avatar}
          alt={username}
          width={500}
          height={500}
          className="w-lg h-lg rounded-full object-cover border-2 border-gray-700"
        />
  
        {/* Nombre de usuario */}
        <p className="mt-2 text-sm text-white font-semibold truncate">{username}</p>
      </div>
    );
  };
  
  export default UserCard;
  