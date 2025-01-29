// components/FavButton.js

import { HiPlusCircle } from "react-icons/hi";
import { useSession } from "next-auth/react";
import { useData } from "@/src/hooks/useData"; // Usamos el hook useData
import toast from "react-hot-toast";

const FavButton = ({ songId }) => {
  const { data: session } = useSession();
  const { createData } = useData("/favourite", {}, false); // Hook para la creación de datos

  const handleAddToFavorites = async (e) => {
    e.stopPropagation(); // Evita que el clic en el botón se propague a SongCard

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
    <button
      onClick={handleAddToFavorites}
      className="text-purple-300 hover:text-red-400 transition-colors"
    >
      <HiPlusCircle size={24} />
    </button>
  );
};

export default FavButton;
