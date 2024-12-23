"use client"

import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuthBroadcast = () => {
  const router = useRouter();
  const authChannel = new BroadcastChannel("auth_channel");

  const restoreTabs = () => {
    const lastRoute = sessionStorage.getItem("lastRoute") || "/";
    console.log("lastRoute", lastRoute);
    setTimeout(() => {
      router.replace(lastRoute);
    }, 800);
  };

  const redirectToHome = () => {
    setTimeout(() => {
      router.replace("/");
    }, 800);
  };

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

  const broadcastLogout = (reason = "manual") => {
    sessionStorage.setItem("lastRoute", window.location.pathname);  
    sessionStorage.setItem("logoutReason", reason);
    authChannel.postMessage({ type: "logout", reason });
    signOut({ callbackUrl: "/auth/login" });
  };

  const messageHandlers = {
    login: (data) => handleLogin(data),
    logout: () => handleLogout(),
  };

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

  useEffect(() => {
    authChannel.onmessage = (event) => {
      const handler = messageHandlers[event.data.type];
      if (handler) {
        handler(event.data);
      }
    };

  }, []);

  return { broadcastLogin, broadcastLogout, redirectToHome, restoreTabs, authChannel };
};