import React, { useState } from "react";
import { HiHome, HiOutlineCloudUpload, HiOutlineLogout, HiOutlineCog, HiUser, HiOutlineHeart } from "react-icons/hi"; // Usa solo los iconos si los necesitas

const SidebarRight = () => {
  const [activeTab, setActiveTab] = useState("home"); // Controla la pestaña activa

  // Opciones del menú (puedes agregar más si es necesario)
  const menuItems = [
    { name: "Inicio", key: "home", icon: <HiHome /> },
    { name: "Perfil", key: "profile", icon: <HiUser /> },
    { name: "Favoritos", key: "favourites", icon: <HiOutlineHeart /> },
    { name: "Subir", key: "upload", icon: <HiOutlineCloudUpload /> },
    { name: "Ajustes", key: "settings", icon: <HiOutlineCog /> },
    { name: "Salir", key: "logout", icon: <HiOutlineLogout /> },
  ];

  return (
    <div className="flex">
      {/* Sidebar Derecho */}
      <div className="bg-gradient-to-b from-purple-900 to-purple-950 text-white h-screen w-64 fixed right-0 top-0">
        {/* Contenido del sidebar */}
        <div className="flex flex-col mt-10 space-y-4 px-4">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 ml-0">
        {/* Aquí va el contenido correspondiente basado en activeTab */}

      </div>
    </div>
  );
};

export default SidebarRight;
