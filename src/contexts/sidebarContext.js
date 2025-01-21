"use client";

import { createContext, useContext, useState } from "react";

// Crear contexto
const SidebarContext = createContext();

// Proveedor del contexto
export const SidebarProvider = ({ children }) => {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(true);

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
