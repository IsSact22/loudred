"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { broadcastLogout } from "@/src/utils/authChannel";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useSidebar } from "@/src/contexts/sidebarContext"; // 🔹 Usa el contexto

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
  const pathname = usePathname();
  const { data: session } = useSession();
  const { isLeftSidebarOpen, setLeftSidebarOpen } = useSidebar(); // 🔹 Ahora lo tomamos del contexto

  const userRoleId = session?.user?.role?.id;

  const menuItems = [
    { name: "Inicio", path: "/", icon: <HiHome /> },
    { name: "Perfil", path: "/profile", icon: <HiUser /> },
    { name: "Favoritos", path: "/favourites", icon: <HiOutlineHeart /> },
    { name: "Subir", path: "/upload", icon: <HiOutlineCloudUpload /> },
    { name: "Ajustes", path: "/settings", icon: <HiOutlineCog /> },
    ...(userRoleId === 2
      ? [{ name: "Administrador", path: "/admin", icon: <HiOutlineViewGridAdd /> }]
      : []),
    { name: "Salir", key: "logout", icon: <HiOutlineLogout /> },
  ];

  const handleLogout = () => {
    toast((t) => (
      <div className="flex flex-col items-center p-6 bg-white rounded-lg text-center">
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
          <button onClick={() => toast.dismiss(t.id)} className="bg-gray-500 text-white py-1 px-4 rounded">
            No
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="absolute top-0">
      <div
        className={`bg-gradient-to-b from-purple-900 to-purple-950 text-white h-screen transition-all duration-300 ${
          isLeftSidebarOpen ? "w-64" : "w-16"
        } relative`}
      >
        <button
          className="absolute top-8 right-[-16px] bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg focus:outline-none z-10"
          onClick={() => setLeftSidebarOpen(!isLeftSidebarOpen)} // 🔹 Usa `setLeftSidebarOpen`
        >
          ☰
        </button>

        {isLeftSidebarOpen && (
          <div>
            <div className="flex items-center justify-between px-4 py-4">
              <h1 className="text-2xl font-bold">
                <Image
                  src={"/assets/loudred-logo4.png"}
                  alt="Logo"
                  width={150}
                  height={75}
                  className={`mt-4 ml-6 transition-opacity duration-300 ${
                    !isLeftSidebarOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
              </h1>
            </div>
            <nav className="mt-8 space-y-4">
              {menuItems.map((item) => {
                if (item.key === "logout") {
                  return (
                    <button
                      key={item.key}
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 w-full text-lg transition-all duration-300 ease-in-out transform rounded hover:bg-purple-800 hover:scale-105"
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
                    className={`flex items-center px-4 py-2 text-lg transition-all duration-300 ease-in-out transform rounded hover:bg-purple-800 hover:scale-105 ${
                      pathname === item.path ? "bg-red-500 text-white scale-105 shadow-lg" : ""
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
    </div>
  );
};

export default SidebarLeft;
