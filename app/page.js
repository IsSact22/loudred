"use client";
// Components
import SidebarLeft from "@/src/components/bars/SidebarLeft";
import SidebarRight from "@/src/components/bars/SidebarRight"; 
import SearchBar from "@/src/components/navegation/SearchBar";
import React from "react";
import SongCard from "@/src/components/cards/SongsCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
// Next
import { useSession } from "next-auth/react";
// Utils
import { broadcastLogout } from "@/src/utils/authChannel";

export default function Home() {
  const { data: session } = useSession();

  // Usar directamente el rol desde la sesión
  const userRoleName = session?.user?.role?.name;

  const handleSearch = (query) => {
    console.log("Buscando:", query);
    // Aquí puedes agregar lo que desees hacer con la búsqueda, como filtrar resultados o hacer una consulta.
  };


  return (
    <div className="flex bg-slate-950">
      {/* Sidebar */}
      <SidebarLeft />
      <SidebarRight />


      {/* Contenido principal */}
      <div className="flex-1 p-6">
        <div className="flex flex-col items-center justify-center gap-2">
          {/* Barra de búsqueda */}
          <div className="w-full flex justify-center mb-2">
            <SearchBar onSearch={handleSearch} />
          </div>
          {/* <h1>
            Bienvenido, {session?.user.name}{" "}
            {userRoleName === "SUPERADMIN" ? "(SUPERADMIN)" : ""}
          </h1> */}

          {/* Botón para cerrar sesión */}
          {/* <button type="button" onClick={() => broadcastLogout("manual")}>
            Cerrar Sesión
          </button>
          <button
            type="button"
            onClick={() => broadcastLogout("sessionExpired")}
          >
            Cerrar Sesión por expiración
          </button> */}

          {/* {userRoleName === "SUPERADMIN" && (
            <div>
              <h2>Me la pelan somos arrecho</h2>
            </div>
          )} */}

          {/* {userRoleName === "USER" && (
            <div>
              <h2>Bienvenido, webones proveedores de nuestra locura.</h2>
            </div>
          )} */}
          
        </div>
      </div>
    </div>
  );
}