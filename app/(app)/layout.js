"use client";
import SidebarRight from "@/src/components/bars/SidebarRight";
import SidebarLeft from "@/src/components/bars/SidebarLeft";
import CaptchaModal from "@/src/partials/auth/components/CaptchaModal";
import { SidebarProvider, useSidebar } from "@/src/contexts/sidebarContext";
import { useCaptchaStore } from "@/src/stores/captchaStore";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { HiMusicNote } from "react-icons/hi";


const AppLayout = ({ children }) => {
  const { isLeftSidebarOpen, isRightSidebarOpen, setRightSidebarOpen, setLeftSidebarOpen } = useSidebar();
  const { showModal } = useCaptchaStore();
  const pathname = usePathname();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(false);
    const timeout = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div
      className={`grid h-screen w-full overflow-hidden transition-all duration-500 ${
        isLeftSidebarOpen ? "grid-cols-[16rem_1fr]" : "grid-cols-[40px_1fr]"  // Aumento de la franja
      } ${isRightSidebarOpen ? "md:grid-cols-[auto_1fr_20rem]" : "md:grid-cols-[auto_1fr]"}`}
    >
      <CaptchaModal isOpen={showModal} />

      {/* Sidebar izquierdo */}
      <div
        className={`bg-gray-900 h-full transition-all duration-300 ${isLeftSidebarOpen ? "w-64" : "w-16"} border-r border-gray-700`}
      >
        <SidebarLeft />
      </div>

      {/* Contenido principal con animación */}
      <div
        className={`relative overflow-hidden transition-all duration-700 ease-in-out ${
          fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {children}
      </div>

      {/* Sidebar derecho */}
      {isRightSidebarOpen && (
        <div className="h-full w-80 bg-gradient-to-b from-purple-900 to-purple-950 text-white fixed right-0 top-0 z-30">
          <SidebarRight />
        </div>
      )}

      {/* Botón para abrir/cerrar SidebarRight en móviles */}
      <button
        onClick={() => setRightSidebarOpen((prev) => !prev)} // Alterna el estado
        className="absolute top-4 right-4 z-40 bg-red-600 text-white p-2 rounded-full md:hidden"
      >
        <HiMusicNote />

      </button>
    </div>
  );
};

export default function LayoutWrapper({ children }) {
  return (
    <SidebarProvider>
      <AppLayout>{children}</AppLayout>
    </SidebarProvider>
  );
}
