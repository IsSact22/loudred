'use client';

// React
import React, { createContext, useContext, useState } from "react";

// Crear el contexto
const PlayerContext = createContext();

// Componente proveedor del contexto
export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);

  const playSong = (song) => {
    setCurrentSong(song);
  };

  return (
    <PlayerContext.Provider value={{ currentSong, playSong }}>
      {children}
    </PlayerContext.Provider>
  );
};

// Hook para consumir el contexto
export const usePlayer = () => useContext(PlayerContext);
