// Hooks
import { useAuthBroadcast } from "@/src/hooks/useAuthBroadcast";
// React
import { useCallback } from "react";
// Stores
import { useSessionStore } from "@/src/stores/sessionStore";

export const useSessionDecision = () => {
  const { setShowModal } = useSessionStore();
  const { restoreTabs, redirectToHome, authChannel } = useAuthBroadcast();

  const handleRestore = useCallback(() => {
    authChannel.postMessage({ type: "login", action: "restore" });
    setShowModal(false);
    restoreTabs();
  }, []);

  const handleHome = useCallback(() => {
    authChannel.postMessage({ type: "login", action: "home" });
    setShowModal(false);
    redirectToHome();
  }, []);

  return {
    handleRestore,
    handleHome,
  };
};