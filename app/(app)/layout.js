"use client";
import SidebarRight from "@/src/components/bars/SidebarRight";
import SidebarLeft from "@/src/components/bars/SidebarLeft";
import CaptchaModal from "@/src/partials/auth/components/CaptchaModal";
import { SidebarProvider } from "@/src/contexts/sidebarContext";
import { useCaptchaStore } from "@/src/stores/captchaStore";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const AppLayout = ({ children }) => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const { showModal } = useCaptchaStore();
  const pathname = usePathname();

  // Estado para manejar la animación de transición
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(false); // Oculta el contenido al cambiar de página
    const timeout = setTimeout(() => setFadeIn(true), 50); // Activa la animación después de un breve retraso

    return () => clearTimeout(timeout);
  }, [pathname]); // Se ejecuta en cada cambio de ruta

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <CaptchaModal isOpen={showModal} />

      <SidebarProvider>
        {/* Sidebar izquierdo */}
        <div
          className={`relative left-0 top-0 bottom-0 z-20 h-screen transition-all duration-300 ${
            isLeftSidebarOpen ? "w-64" : "w-16"
          }`}
        >
          <SidebarLeft
            isOpen={isLeftSidebarOpen}
            setIsOpen={setIsLeftSidebarOpen}
          />
        </div>

        {/* Contenido principal con transición */}
        <div
          key={pathname} // Asegura que el contenido se re-renderice al cambiar la ruta
          className={`flex-1 relative overflow-hidden transition-all duration-700 ease-in-out`}
        >
          <div
            className={`absolute w-full h-full transition-all duration-700 ease-in-out transform ${
              fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {children}
          </div>
        </div>

        {/* Sidebar derecho */}
        <div className="h-screen w-80 relative right-0 top-0 z-20 bg-gradient-to-b from-purple-900 to-purple-950 text-white">
          <SidebarRight />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AppLayout;
