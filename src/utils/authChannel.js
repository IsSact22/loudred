"use client";

import { signIn, signOut } from "next-auth/react";

// Crear una instancia singleton del BroadcastChannel
let authChannel;

if (typeof window !== "undefined") {
  authChannel = new BroadcastChannel("auth_channel");
}

/**
 * Función para manejar la transmisión de inicio de sesión
 * @param {Object} credentials - Credenciales de usuario
 * @returns {Object} Resultado del intento de inicio de sesión
 */
export const broadcastLogin = async (credentials) => {
  const result = await signIn("credentials", {
    redirect: false,
    ...credentials,
  });

  if (!result.error && authChannel) {
    const logoutReason = sessionStorage.getItem("logoutReason");
    authChannel.postMessage({ type: "login", reason: logoutReason });
  }

  return result;
};

/**
 * Función para manejar la transmisión de cierre de sesión
 * @param {string} reason - Razón del cierre de sesión (por defecto "manual")
 */
export const broadcastLogout = (reason = "manual") => {
  if (authChannel) {
    // No establecer 'lastRoute' aquí para evitar sobrescribir en otras pestañas
    sessionStorage.setItem("logoutReason", reason);
    authChannel.postMessage({ type: "logout", reason });
  }
  signOut({ callbackUrl: "/auth/login" });
};

export default authChannel;
