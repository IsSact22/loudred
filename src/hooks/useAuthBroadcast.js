"use client";

import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import authChannel, {broadcastLogin, broadcastLogout} from "@/src/utils/authChannel";

export const useAuthBroadcast = () => {
  const router = useRouter();

  // Función para restaurar la pestaña a la última ruta
  const restoreTabs = () => {
    const lastRoute = sessionStorage.getItem("lastRoute") || "/";
    console.log("Restoring to lastRoute:", lastRoute);
    setTimeout(() => {
      router.replace(lastRoute);
    }, 800);
  };

  // Función para redirigir a la página de inicio
  const redirectToHome = () => {
    setTimeout(() => {
      router.replace("/");
    }, 800);
  };

  // Mapeo de manejadores de mensajes
  const messageHandlers = {
    login: (data) => handleLogin(data),
    logout: () => handleLogout(),
  };

  // Mapeo de acciones de inicio de sesión
  const loginActionHandlers = {
    home: redirectToHome,
    restore: restoreTabs,
  };

  // Manejador para eventos de inicio de sesión
  const handleLogin = ({ reason, action }) => {
    if (reason === "manual") {
      redirectToHome();
    } else if (action && loginActionHandlers[action]) {
      loginActionHandlers[action]();
    }
  };

  // Manejador para eventos de cierre de sesión
  const handleLogout = () => {
    // Cada pestaña almacena su propia 'lastRoute' antes de cerrar sesión
    sessionStorage.setItem("lastRoute", window.location.pathname);
    signOut({ callbackUrl: "/auth/login" });
  };

  useEffect(() => {
    authChannel.onmessage = (event) => {
      const handler = messageHandlers[event.data.type];
      if (handler) {
        handler(event.data);
      }
    };

  }, []);

  return {
    broadcastLogin,
    broadcastLogout,
    redirectToHome,
    restoreTabs,
    authChannel,
  };
};
