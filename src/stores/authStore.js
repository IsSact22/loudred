// src/store/authStore.js
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isLogin: true, // Estado inicial
  setIsLogin: (value) => set({ isLogin: value }),
}));