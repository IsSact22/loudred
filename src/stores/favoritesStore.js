import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

export const useFavoritesStore = create(
  persist(
    (set) => ({
      favorites: [], // Lista de canciones favoritas (IDs)

      // Función para agregar una canción a favoritos
      addFavorite: (songId) => set((state) => {
        if (!state.favorites.includes(songId)) {
          return { favorites: [...state.favorites, songId] };
        }
        return state; // Si ya está en favoritos no se agrega de nuevo
      }),

      // Función para eliminar una canción de favoritos
      removeFavorite: (songId) => set((state) => ({
        favorites: state.favorites.filter((id) => id !== songId),
      })),
      
      // Verificar si una canción está en favoritos
      isFavorite: (songId) => (state) => state.favorites.includes(songId),
    }),
    {
      name: "favorites-store", // Nombre del almacenamiento persistente
      getStorage: () => ({
        getItem: (name) => Cookies.get(name),
        setItem: (name, value) => Cookies.set(name, value),
        removeItem: (name) => Cookies.remove(name),
      }), // Usamos cookies para almacenamiento persistente
    }
  )
);
