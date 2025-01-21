"use client";
import SidebarLeft from "../components/bars/SidebarLeft";
import SidebarRight from "../components/bars/SidebarRight";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

export default function SideLayout({ children }) {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");

  // Estado para controlar si el sidebar izquierdo está abierto o cerrado
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      {!isAuthRoute && (
        <>
          {/* Sidebar izquierdo */}
          <div
            className={`bg-slate-950 fixed left-0 top-0 bottom-0 z-10 transition-all duration-300 ${
              isLeftSidebarOpen ? "w-64" : "w-16"
            }`}
          >
            <SidebarLeft
              isOpen={isLeftSidebarOpen}
              setIsOpen={setIsLeftSidebarOpen}
            />
          </div>
        </>
      )}
      {/* Contenido principal */}
      <div
        className={`flex-1 ${
          !isAuthRoute ? (isLeftSidebarOpen ? "ml-64" : "ml-16") : ""
        } ${!isAuthRoute ? "mr-64" : ""} relative overflow-y-auto transition-all duration-300 z-0`}
      >
        {children}
      </div>
      {!isAuthRoute && (
        <>
          {/* Sidebar derecho */}
          <div className="bg-gradient-to-b from-purple-900 to-purple-950 text-white h-screen w-80 fixed right-0 top-0 z-20">
            <SidebarRight />
          </div>
        </>
      )}
    </div>
  );
}