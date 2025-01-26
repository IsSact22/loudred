import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

export const usePlayerStore = create(
  persist(
    (set) => ({
      // Estado para controlar la reproducción
      isPlaying: false,
      currentSong: null, // Canción actual en reproducción
      currentPlaylist: [], // Lista de canciones activa
      setPlaylist: (playlist) => set({ currentPlaylist: playlist }),
      setCurrentSong: (song) => set({ currentSong: song }),
      setIsPlaying: (value) => set({ isPlaying: value }),

      // Control de reproducción
      playSong: (song, playlist) =>
        set({
          currentSong: song,
          currentPlaylist: playlist,
          isPlaying: true,
        }),
    }),
    {
      name: "player-store",
      getStorage: () => ({
        getItem: (name) => Cookies.get(name),
        setItem: (name, value) => Cookies.set(name, value),
        removeItem: (name) => Cookies.remove(name),
      }),
    }
  )
);
