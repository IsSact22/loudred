"use client";

import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuthBroadcast = () => {
  const router = useRouter();
  const authChannel = new BroadcastChannel("auth_channel");

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

  // Función para manejar la transmisión de inicio de sesión
  const broadcastLogin = async (credentials) => {
    const result = await signIn("credentials", {
      redirect: false,
      ...credentials,
    });

    if (!result.error) {
      const logoutReason = sessionStorage.getItem("logoutReason");
      authChannel.postMessage({ type: "login", reason: logoutReason });
    }

    return result;
  };

  // Función para manejar la transmisión de cierre de sesión
  const broadcastLogout = (reason = "manual") => {
    // No establecemos 'lastRoute' aquí para evitar sobrescribir en otras pestañas
    sessionStorage.setItem("logoutReason", reason);
    authChannel.postMessage({ type: "logout", reason });
    signOut({ callbackUrl: "/auth/login" });
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
