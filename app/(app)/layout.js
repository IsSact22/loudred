"use client";
import SidebarRight from "@/src/components/bars/SidebarRight";
import SidebarLeft from "@/src/components/bars/SidebarLeft";
import CaptchaModal from "@/src/partials/auth/components/CaptchaModal";
import { SidebarProvider } from "@/src/contexts/sidebarContext";
import { useCaptchaStore } from "@/src/stores/captchaStore";
import React, { useState } from "react";

const AppLayout = ({ children }) => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const { showModal } = useCaptchaStore();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <CaptchaModal isOpen={showModal} />

      <SidebarProvider>
        {/* Sidebar izquierdo siempre visible */}
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

        {/* Contenido principal */}
        <div
          className={`flex-1 relative overflow-y-auto transition-all duration-300 z-0`}
        >
          {children}
        </div>

        {/* Sidebar derecho siempre visible */}
        <div className="h-screen w-80 relative right-0 top-0 z-20 bg-gradient-to-b from-purple-900 to-purple-950 text-white ">
          <SidebarRight />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AppLayout;
