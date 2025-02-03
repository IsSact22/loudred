import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

export const useCaptchaStore = create(
  persist(
    (set) => ({
      showModal: true,
      setShowModal: (value) => set({ showModal: value }),
    }),
    {
      name: "captcha-store",
      getStorage: () => ({
        getItem: (name) => Cookies.get(name),
        setItem: (name, value) => Cookies.set(name, value),
        removeItem: (name) => Cookies.remove(name),
      }),
    }
  )
);
