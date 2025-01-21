"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { broadcastLogout } from "@/src/utils/authChannel";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
// Iconos
import {
  HiHome,
  HiOutlineCloudUpload,
  HiOutlineLogout,
  HiOutlineCog,
  HiUser,
  HiOutlineHeart,
  HiOutlineViewGridAdd,
} from "react-icons/hi";

const SidebarLeft = () => {
  const pathname = usePathname(); // Detecta la ruta actual
  const { data: session } = useSession();
  const userRoleId = session?.user?.role?.id;

  const [isOpen, setIsOpen] = useState(true);

  // Opciones del menú
  const menuItems = [
    { name: "Inicio", path: "/", icon: <HiHome /> },
    { name: "Perfil", path: "/profile", icon: <HiUser /> },
    { name: "Favoritos", path: "/favourites", icon: <HiOutlineHeart /> },
    { name: "Subir", path: "/upload", icon: <HiOutlineCloudUpload /> },
    // Importante: la barra inicial
    { name: "Ajustes", path: "/settings", icon: <HiOutlineCog /> },
    ...(userRoleId === 2
      ? [
          {
            name: "Administrador",
            path: "/superAdmin",
            icon: <HiOutlineViewGridAdd />,
          },
        ]
      : []),
    { name: "Salir", key: "logout", icon: <HiOutlineLogout /> },
  ];

  const handleLogout = () => {
    toast((t) => (
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg text-center">
        <span className="text-xl mb-4">¿Seguro que deseas cerrar sesión?</span>
        <div className="flex gap-4">
          <button
            onClick={() => {
              broadcastLogout("manual");
              toast.dismiss(t.id);
            }}
            className="bg-red-500 text-white py-1 px-4 rounded"
          >
            Sí
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-500 text-white py-1 px-4 rounded"
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="absolute top-0">
      {/* Sidebar */}
      <div
        className={`bg-gradient-to-b from-purple-900 to-purple-950 text-white h-screen transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        } relative`}
      >
        <button
          className="absolute top-4 right-[-16px] bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg focus:outline-none z-10"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        {isOpen && (
          <div>
            <div className="flex items-center justify-between px-4 py-4">
              <h1 className="text-2xl font-bold">LOUDRED</h1>
            </div>
            <nav className="mt-10 space-y-4">
              {menuItems.map((item) => {
                if (item.key === "logout") {
                  return (
                    <button
                      key={item.key}
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 text-lg transition-all rounded relative hover:bg-purple-800"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="ml-4">{item.name}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center px-4 py-2 text-lg transition-all rounded hover:bg-purple-800 ${
                      pathname === item.path ? "bg-red-500 text-white" : ""
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="ml-4">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Aquí Next.js cargará automáticamente las páginas según la ruta */}
      </div>
    </div>
  );
};

export default SidebarLeft;
