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
    <div className="flex h-screen overflow-hidden">
      <CaptchaModal isOpen={showModal} />

      <SidebarProvider>
        {/* Sidebar izquierdo siempre visible */}
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

        {/* Contenido principal */}
        <div
          className={`flex-1 ${
            isLeftSidebarOpen ? "ml-64" : "ml-16"
          } mr-64 relative overflow-y-auto transition-all duration-300 z-0`}
        >
          {children}
        </div>

        {/* Sidebar derecho siempre visible */}
        <div className="bg-gradient-to-b from-purple-900 to-purple-950 text-white h-screen w-80 fixed right-0 top-0 z-20">
          <SidebarRight />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AppLayout;
