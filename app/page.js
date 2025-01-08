"use client";
// Components
import SidebarLeft from "@/src/components/bars/SidebarLeft";
import SidebarRight from "@/src/components/bars/SidebarRight"; 
import SearchBar from "@/src/components/navegation/SearchBar";
import { CarouselSongs } from "@/src/components/navegation/Carrousel";
// React
import React from "react";

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
  };

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar izquierdo */}
      <div className="w-64">
        <SidebarLeft />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center justify-start p-6">
        {/* Barra de búsqueda */}
        <div className="w-full max-w-2xl mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Carrusel */}
        <div className="w-full max-w-4xl">
          <CarouselSongs />
        </div>

        <div>
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

      {/* Sidebar derecho */}
      <div className="w-64 bg-slate-800">
        <SidebarRight />
      </div>
    </div>
  );
}
