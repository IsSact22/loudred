
/* React */
import { useCallback } from "react";

/* Store */
import { useSessionStore } from "@/src/stores/sessionStore";

/* Utils */
import { authChannel, restoreTabs, redirectToHome } from "@/src/utils/broadcastAuth";

export const useSessionDecision = () => {
  const { setIsDecided, setShowModal } = useSessionStore();

  const handleRestore = useCallback(() => {
    authChannel.postMessage({ type: "login", action: "restore" });
    setShowModal(false);
    setIsDecided(true);
    restoreTabs();
  }, [setIsDecided]);

  const handleHome = useCallback(() => {
    authChannel.postMessage({ type: "login", action: "home" });
    setShowModal(false);
    setIsDecided(true);
    redirectToHome();
  }, [setIsDecided]);

  return {
    handleRestore,
    handleHome,
  };
};