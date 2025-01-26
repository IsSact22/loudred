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
  
        // Avanzar a la siguiente canción
        playNextSong: () =>
          set((state) => {
            const currentIndex = state.currentPlaylist.findIndex(
              (s) => s.id === state.currentSong?.id
            );
            const nextSong =
              currentIndex >= 0 && currentIndex < state.currentPlaylist.length - 1
                ? state.currentPlaylist[currentIndex + 1]
                : null;
            return {
              currentSong: nextSong,
              isPlaying: !!nextSong,
            };
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
  