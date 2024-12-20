import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

export const useSessionStore = create(
  persist(
    (set) => ({
      isDecided: false,
      setIsDecided: (value) => set({ isDecided: value }),
      isLogging: false,
      setIsLogging: (value) => set({ isLogging: value }),
      showModal: false,
      setShowModal: (value) => set({ showModal: value }),
    }),
    {
      name: "session-storage",
      getStorage: () => ({
        getItem: (name) => Cookies.get(name),
        setItem: (name, value) => Cookies.set(name, value),
        removeItem: (name) => Cookies.remove(name),
      }),
    }
  )
);
