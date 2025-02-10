"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Crear contexto
const SidebarContext = createContext();

// Proveedor del contexto
export const SidebarProvider = ({ children }) => {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(true);

  useEffect(() => {
    // Ocultar ambos sidebars en móviles y mostrarlos en pantallas grandes
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setLeftSidebarOpen(false);
        setRightSidebarOpen(false);
      } else {
        setLeftSidebarOpen(true);
        setRightSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isLeftSidebarOpen,
        setLeftSidebarOpen,
        isRightSidebarOpen,
        setRightSidebarOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

// Hook para usar el contexto
export const useSidebar = () => useContext(SidebarContext);
