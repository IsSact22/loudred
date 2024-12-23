import { signIn, signOut } from "next-auth/react";

export const authChannel = new BroadcastChannel("auth_channel");

export const broadcastLogin = async (credentials) => {
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

export const broadcastLogout = (reason = "manual") => {
  // Almacenar la ruta actual y la razón en el almacenamiento de sesión para esta pestaña
  sessionStorage.setItem("lastRoute", window.location.pathname);
  sessionStorage.setItem("logoutReason", reason);
  authChannel.postMessage({ type: "logout", reason });
  signOut({ callbackUrl: "/auth/login" });
};