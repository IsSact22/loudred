import { useRouter } from "next/navigation";
// components/Sidebar.js
import React, { useState } from "react";
import SongsForm from "@/src/partials/songs/SongsForm";
import UpdateForm from "@/src/partials/profile/UpdateForm";
import { broadcastLogout } from "@/src/utils/authChannel";
import { toast } from "react-hot-toast"; // Importa toast
//iconos
import { HiHome } from "react-icons/hi";
import { HiOutlineCloudUpload } from "react-icons/hi";
import { HiOutlineLogout } from "react-icons/hi";
import { HiOutlineCog } from "react-icons/hi";
import { HiUser } from "react-icons/hi";
import { HiOutlineHeart } from "react-icons/hi";

const SidebarLeft = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("home"); // Controla la pestaña activa
  const router = useRouter(); // Usamos useRouter de next/navigation


  // Opciones del menú
  const menuItems = [
    { name: "Inicio", key: "home", icon: <HiHome /> },
    { name: "Perfil", key: "profile", icon: <HiUser /> },
    { name: "Favoritos", key: "favourites", icon: <HiOutlineHeart /> },
    { name: "Subir", key: "upload", icon: <HiOutlineCloudUpload /> },
    { name: "Ajustes", key: "settings", icon: <HiOutlineCog /> },
    { name: "Salir", key: "logout", icon: <HiOutlineLogout /> },
  ];

  const handleHomeClick = () => {
    setActiveTab("home");
    router.push("/"); // Redirige a la página principal
  };

  const handleLogout = () => {
    toast((t) => (
      <div
        className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg max-w-xs w-full text-center"
        
      >
        <span className="text-xl mb-4" >¿Seguro que deseas cerrar sesión?</span>
        <div className="flex gap-4" >
          <button
            onClick={() => {
              broadcastLogout("manual");
              toast.dismiss(t.id); // Cierra el toast al confirmar
            }}
            className="bg-red-500 text-white py-1 px-4 rounded mr-2"
          >
            Sí
          </button>
          <button
            onClick={() => toast.dismiss(t.id)} // Cierra el toast al cancelar
            className="bg-gray-500 text-white py-1 px-4 rounded"
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-gradient-to-b from-purple-900 to-purple-950 text-white h-screen transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        } relative`}
      >
        {/* Botón de hamburguesa */}
        <button
          className="absolute top-4 right-[-16px] bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg focus:outline-none z-10"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        {/* Contenido del sidebar */}
        {isOpen && (
          <div>
            <div className="flex items-center justify-between px-4 py-4">
              <h1 className="text-2xl font-bold">LOUDRED</h1>
            </div>
            <nav className="mt-10 space-y-4">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    if (item.key === "home") {
                      handleHomeClick();
                    } else if (item.key === "logout") {
                      handleLogout(); // Muestra el toast al presionar salir
                    } else {
                      setActiveTab(item.key);
                    }
                  }}
                  className={`flex items-center px-4 py-2 text-lg transition-all rounded relative ${
                    activeTab === item.key ? "bg-red-500 text-white" : "hover:bg-purple-800"
                  }`}
                >
                  {activeTab === item.key && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-2xl"></div>
                  )}
                  <span className="material-icons">{item.icon}</span>
                  <span className="ml-4">{item.name}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeTab === "home"}

        {activeTab === "upload" && (
          <div>
            <SongsForm />
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <UpdateForm />
          </div>
        )}

        {activeTab === "logout" && (
          <div>
            <button type="button" onClick={() => broadcastLogout("manual")}>
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarLeft;
