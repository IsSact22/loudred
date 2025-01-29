import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      isPlaying: false,
      currentSong: null,
      currentPlaylist: [],
      originalPlaylist: [], // Guarda la lista original
      isShuffled: false,

      setPlaylist: (playlist) => set({ currentPlaylist: playlist, originalPlaylist: playlist }),
      setCurrentSong: (song) => set({ currentSong: song }),
      setIsPlaying: (value) => set({ isPlaying: value }),

      playSong: (song, playlist) =>
        set({ currentSong: song, currentPlaylist: playlist, isPlaying: true }),

      toggleShuffle: () => {
        const { isShuffled, originalPlaylist, currentSong } = get();

        if (isShuffled) {
          // Desactiva aleatorio y restaura el orden original
          set({ currentPlaylist: originalPlaylist, isShuffled: false });
          // Asegurarse de que la canción actual se reproduzca correctamente
          set({ currentSong: originalPlaylist.find(song => song.id === currentSong?.id) });
        } else {
          // Activa aleatorio solo para las canciones siguientes
          const currentIndex = originalPlaylist.findIndex(song => song.id === currentSong?.id);
          const nextSongs = originalPlaylist.slice(currentIndex + 1);

          // Aleatorizamos las canciones siguientes
          for (let i = nextSongs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nextSongs[i], nextSongs[j]] = [nextSongs[j], nextSongs[i]];
          }

          // Reajustamos la lista de reproducción
          set({
            currentPlaylist: [
              ...originalPlaylist.slice(0, currentIndex + 1), // Deja las canciones anteriores intactas
              ...nextSongs, // Y solo aleatorizamos las siguientes
            ],
            isShuffled: true,
          });
        }
      },
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
