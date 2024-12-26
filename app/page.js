"use client";
// Components
import SongsForm from "@/src/partials/songs/SongsForm";
import UpdateForm from "@/src/partials/profile/UpdateForm";
// Next
import { useSession } from "next-auth/react";
// React
import { useState } from "react";
// Utils
import { broadcastLogout } from "@/src/utils/authChannel";

export default function Home() {
  const { data: session } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [showFormUser, setShowFormUser] = useState(false);

  // Usar directamente el rol desde la sesión
  const userRoleName = session?.user?.role?.name;

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2">
        <h1>
          Bienvenido, {session?.user.name}{" "}
          {userRoleName === "SUPERADMIN" ? "(SUPERADMIN)" : ""}
        </h1>

        {/* Botón para cerrar sesión */}
        <button type="button" onClick={() => broadcastLogout("manual")}>
          Cerrar Sesión
        </button>
        <button type="button" onClick={() => broadcastLogout("sessionExpired")}>
          Cerrar Sesión por expiración
        </button>

        {userRoleName === "SUPERADMIN" && (
          <div>
            <h2>Me la pelan somos arrecho</h2>
            {/* Opciones o funcionalidades */}
          </div>
        )}

        {userRoleName === "USER" && (
          <div>
            <h2>Bienvenido, webones proveedores de nuestra locura .</h2>
            {/* Opciones o funcionalidades específicas para el rol USER */}
          </div>
        )}

        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cerrar Formulario" : "Subir Canción"}
        </button>

        {showForm && <SongsForm />}

        <button onClick={() => setShowFormUser(!showFormUser)}>
          {showFormUser ? "Cerrar Formulario" : "Actualizar datos"}
        </button>

        {showFormUser && <UpdateForm />}

      </div>
    </>
  );
}
