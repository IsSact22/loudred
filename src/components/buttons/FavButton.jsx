"use client";

import { TbHeart } from "react-icons/tb";
import { useSession } from "next-auth/react";
import { useData } from "@/src/hooks/useData";
import toast from "react-hot-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

function FavButton({ songId }) {
  const { data: session } = useSession();
  const { createData } = useData("/favourite", {}, false);

  const handleAddToFavorites = async (e) => {
    e.stopPropagation();

    if (!session?.user?.id) {
      toast.error("Por favor, inicia sesión para agregar a favoritos.");
      return;
    }

    const payload = {
      userId: session.user.id,
      songId,
    };

    try {
      await createData(payload);
      toast.success("Canción agregada a favoritos.");
    } catch (error) {
      console.error("Error al manejar favoritos:", error);
      toast.error("Hubo un problema al actualizar favoritos.");
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <button
            onClick={handleAddToFavorites}
            className="text-purple-300 hover:text-red-400 transition-colors"
          >
            <TbHeart size={24} />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Agregar a favoritos</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default FavButton;