// Next
import { signIn, signOut } from "next-auth/react";

export const authChannel = new BroadcastChannel("auth_channel");

// Función para manejar la transmisión de inicio de sesión
export const broadcastLogin = async (credentials) => {
  const result = await signIn("credentials", {
    redirect: false,
    ...credentials,
  });

  if (!result.error) {
    // Obtenemos la razón del cierre de sesión anterior
    const logoutReason = sessionStorage.getItem("logoutReason");

    // Enviamos el evento de inicio de sesión con la razón incluida
    authChannel.postMessage({ type: "login", reason: logoutReason });
  }

  return result;
};

// Función para manejar la transmisión de cierre de sesión
export const broadcastLogout = (reason = "manual") => {
  // Almacenar la ruta actual y la razón en el almacenamiento de sesión para esta pestaña
  sessionStorage.setItem("lastRoute", window.location.pathname);
  sessionStorage.setItem("logoutReason", reason);
  authChannel.postMessage({ type: "logout", reason });
  signOut({ callbackUrl: "/auth/login" });
};

// Función para restaurar las pestañas
export const restoreTabs = () => {
  const lastRoute = sessionStorage.getItem("lastRoute") || "/";
  setTimeout(() => {
    window.location.replace(lastRoute);
  }, 800);
};

// Función para redirigir a la página de inicio
export const redirectToHome = () => {
  setTimeout(() => {
    window.location.replace("/");
  }, 800);
};

// Mapeo de manejadores de mensajes
const messageHandlers = {
  login: (data) => handleLogin(data),
  logout: () => handleLogout(),
};

// Escuchar eventos en otras pestañas
authChannel.onmessage = (event) => {
  const handler = messageHandlers[event.data.type];
  if (handler) {
    handler(event.data);
  }
};

// Mapeo de acciones de inicio de sesión
const loginActionHandlers = {
  home: redirectToHome,
  restore: restoreTabs,
};

const handleLogin = ({ reason, action }) => {
  if (reason === "manual") {
    redirectToHome();
  } else if (action && loginActionHandlers[action]) {
    loginActionHandlers[action]();
  }
};

const handleLogout = () => {
  signOut({ callbackUrl: "/auth/login" });
};
