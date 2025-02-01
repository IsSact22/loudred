import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { immer } from "zustand/middleware/immer";

export const usePlayerStore = create(
  persist(
    immer((set, get) => ({
      isPlaying: false, // Ahora no persistente
      currentSong: null,
      currentPlaylist: [],
      originalPlaylist: [],
      isShuffled: false,
      shuffledPlaylist: [], // Nueva propiedad para mejor control del shuffle
      playedIndices: [], // Rastrea índices reproducidos en modo shuffle

      // Separamos las acciones en un objeto para mejor organización
      actions: {
        setPlayingState: (value) => set({ isPlaying: value }),
        setPlaylist: (playlist) =>
          set((state) => {
            state.currentPlaylist = playlist;
            state.originalPlaylist = playlist;
            state.shuffledPlaylist = [];
            state.playedIndices = [];
          }),

        setCurrentSong: (song) =>
          set((state) => {
            state.currentSong = song;
            state.isPlaying = false; // Reset play state al cambiar canción manualmente
          }),

        playSong: (song, playlist) =>
          set((state) => {
            state.currentSong = song;
            state.currentPlaylist = playlist;
            state.isPlaying = true;
            // Reset shuffle tracking si es nueva playlist
            if (!state.currentPlaylist.includes(song)) {
              state.shuffledPlaylist = [];
              state.playedIndices = [];
            }
          }),

        toggleShuffle: () => {
          const { isShuffled, originalPlaylist, currentSong } = get();
          if (!originalPlaylist?.length) return; // Evita el toggle si la playlist está vacía

          if (isShuffled) {
            set((state) => {
              state.isShuffled = false;
              state.currentPlaylist = state.originalPlaylist;
              state.shuffledPlaylist = [];
              state.playedIndices = [];
            });
          } else {
            const remainingSongs = originalPlaylist.filter(
              (s) => s.id !== currentSong?.id
            );
            const shuffled = [
              currentSong,
              ...remainingSongs.sort(() => Math.random() - 0.5),
            ];

            set((state) => {
              state.isShuffled = true;
              state.shuffledPlaylist = shuffled;
              state.playedIndices = [0];
              state.currentPlaylist = shuffled; // Solo cambiamos la lista actual
            });
          }
        },

        handleSongEnd: () => {
          const { isShuffled, shuffledPlaylist, playedIndices, actions } =
            get();

          if (isShuffled && shuffledPlaylist.length > 0) {
            const nextIndex =
              (playedIndices[playedIndices.length - 1] + 1) %
              shuffledPlaylist.length;

            if (nextIndex === 0) {
              // Regenerar shuffle excluyendo la canción actual
              const newShuffled = shuffledPlaylist
                .slice(1)
                .sort(() => Math.random() - 0.5);
              set((state) => {
                state.shuffledPlaylist = [state.currentSong, ...newShuffled];
                state.playedIndices = [0];
              });
            }

            set((state) => {
              state.playedIndices.push(nextIndex);
              state.currentSong = state.shuffledPlaylist[nextIndex];
              state.isPlaying = true;
            });
          } else {
            const currentIndex = get().currentPlaylist.findIndex(
              (s) => s.id === get().currentSong?.id
            );
            const nextIndex = (currentIndex + 1) % get().currentPlaylist.length;
            set((state) => {
              state.currentSong = state.currentPlaylist[nextIndex];
              state.isPlaying = true;
            });
          }
        },
      },
    })),
    {
      name: "player-store",
      partialize: (state) => ({
        // Excluimos isPlaying y acciones de la persistencia
        currentSong: state.currentSong,
        currentPlaylist: state.currentPlaylist,
        originalPlaylist: state.originalPlaylist,
        isShuffled: state.isShuffled,
        shuffledPlaylist: state.shuffledPlaylist,
        playedIndices: state.playedIndices,
      }),
      getStorage: () => ({
        getItem: (name) => Cookies.get(name),
        setItem: (name, value) => Cookies.set(name, value),
        removeItem: (name) => Cookies.remove(name),
      }),
    }
  )
);

// Exportamos las acciones por separado para mejor consumo en componentes
export const usePlayerActions = () => usePlayerStore((state) => state.actions);
