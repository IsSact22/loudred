import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { immer } from "zustand/middleware/immer";

// Helper functions para la lógica de shuffle
const shuffleLogic = {
  generateShuffledPlaylist: (currentSong, originalPlaylist) => {
    const others = originalPlaylist.filter(
      (song) => song.id !== currentSong?.id
    );
    return [currentSong, ...others.sort(() => Math.random() - 0.5)];
  },

  getNextIndex: (playedIndices, playlist) => {
    if (playedIndices.length >= playlist.length) return 0;
    return (playedIndices[playedIndices.length - 1] + 1) % playlist.length;
  },

  getPrevIndex: (playedIndices) => {
    return playedIndices.length > 1
      ? playedIndices[playedIndices.length - 2]
      : 0;
  },
};

export const usePlayerStore = create(
  persist(
    immer((set, get) => ({
      isPlaying: false,
      currentSong: null,
      currentPlaylist: [],
      originalPlaylist: [],
      isShuffled: false,
      shuffledPlaylist: [],
      playedIndices: [],

      actions: {
        setPlayingState: (value) => set({ isPlaying: value }),

        setPlaylist: (playlist) =>
          set((state) => {
            state.originalPlaylist = playlist;
            state.currentPlaylist = playlist;
            state.shuffledPlaylist = [];
            state.playedIndices = [];
          }),

        setCurrentSong: (song) =>
          set((state) => {
            state.currentSong = song;
            state.isPlaying = false;
          }),

        playSong: (song, playlist) =>
          set((state) => {
            const isNewPlaylist = !state.originalPlaylist.some(
              (s) => s.id === song.id
            );

            state.currentSong = song;
            state.isPlaying = true;
            state.originalPlaylist = playlist;

            if (isNewPlaylist) {
              state.shuffledPlaylist = shuffleLogic.generateShuffledPlaylist(
                song,
                playlist
              );
              state.playedIndices = [0];
              state.currentPlaylist = state.isShuffled
                ? state.shuffledPlaylist
                : playlist;
            }
          }),

        toggleShuffle: () =>
          set((state) => {
            if (!state.originalPlaylist?.length) return;

            state.isShuffled = !state.isShuffled;

            if (state.isShuffled) {
              state.shuffledPlaylist = shuffleLogic.generateShuffledPlaylist(
                state.currentSong,
                state.originalPlaylist
              );
              state.playedIndices = [0];
              state.currentPlaylist = state.shuffledPlaylist;
            } else {
              state.currentPlaylist = state.originalPlaylist;
            }
          }),

        handleSongEnd: () =>
          set((state) => {
            const {
              isShuffled,
              shuffledPlaylist,
              originalPlaylist,
              playedIndices,
            } = state;
            const currentPlaylist = isShuffled
              ? shuffledPlaylist
              : originalPlaylist;

            const nextIndex = shuffleLogic.getNextIndex(
              playedIndices,
              currentPlaylist
            );
            const newSong = currentPlaylist[nextIndex];

            if (isShuffled) {
              if (nextIndex === 0) {
                state.shuffledPlaylist = shuffleLogic.generateShuffledPlaylist(
                  newSong,
                  originalPlaylist
                );
                state.playedIndices = [0];
              } else {
                state.playedIndices.push(nextIndex);
              }
            }

            state.currentSong = newSong;
            state.isPlaying = true;
          }),

        handleSkipForward: () =>
          set((state) => {
            const {
              isShuffled,
              shuffledPlaylist,
              originalPlaylist,
              playedIndices,
            } = state;
            const currentPlaylist = isShuffled
              ? shuffledPlaylist
              : originalPlaylist;
            if (!currentPlaylist.length) return;

            // Obtener el índice actual. Si no hay, se asume 0.
            const currentIndex =
              playedIndices.length > 0
                ? playedIndices[playedIndices.length - 1]
                : 0;
            // Calcular el siguiente índice (cíclico)
            const nextIndex = (currentIndex + 1) % currentPlaylist.length;

            // Si el índice actual es el último, se completó un ciclo: se reinicia el historial.
            if (currentIndex === currentPlaylist.length - 1) {
              state.playedIndices = [nextIndex]; // nextIndex será 0
            } else {
              state.playedIndices.push(nextIndex);
            }

            state.currentSong = currentPlaylist[nextIndex];

            // En modo shuffle, si se reinició el ciclo, se regenera la lista aleatoria.
            if (isShuffled && nextIndex === 0) {
              state.shuffledPlaylist = shuffleLogic.generateShuffledPlaylist(
                state.currentSong,
                originalPlaylist
              );
            }
          }),

        handleSkipBack: () =>
          set((state) => {
            const {
              isShuffled,
              shuffledPlaylist,
              originalPlaylist,
              playedIndices,
              currentSong,
            } = state;
            // Selecciona el playlist activo
            const currentPlaylist = isShuffled
              ? shuffledPlaylist
              : originalPlaylist;
            if (!currentPlaylist.length) return;

            // Determinar el índice actual:
            // Si existe historial, se toma el último; si no, se busca el índice de currentSong en el playlist.
            const currentIndex =
              playedIndices.length > 0
                ? playedIndices[playedIndices.length - 1]
                : currentPlaylist.findIndex(
                    (song) => song.id === currentSong?.id
                  ) || 0;

            // Calcular el índice anterior de forma cíclica
            const prevIndex =
              (currentIndex - 1 + currentPlaylist.length) %
              currentPlaylist.length;

            // Actualizar el historial:
            // Si hay más de un elemento en playedIndices, se elimina el último para retroceder.
            // En caso contrario (historial "vacío" o con un solo elemento) se establece el nuevo índice.
            if (playedIndices.length > 1) {
              playedIndices.pop();
            } else {
              state.playedIndices = [prevIndex];
            }

            // Actualizar la canción actual con el índice calculado
            state.currentSong = currentPlaylist[prevIndex];
          }),
      },
    })),
    {
      name: "player-store",
      partialize: (state) => ({
        currentSong: state.currentSong,
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

export const usePlayerActions = () => usePlayerStore((state) => state.actions);
