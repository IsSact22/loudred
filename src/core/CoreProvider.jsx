"use client";
// Components
import SessionModal from "@/src/partials/auth/components/SessionModal";
// Hooks
import { useAuthBroadcast } from "@/src/hooks/useAuthBroadcast";
import { useIsClient } from "@uidotdev/usehooks";
// Next
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
// React
import { useEffect } from "react";
// Store
import { useSessionStore } from "../stores/sessionStore";
// Toast
import toast from "react-hot-toast";

export const CoreProvider = ({ children }) => {
  return (
    <SessionProvider refetchInterval={60} refetchOnWindowFocus={true}>
      <SessionStatus>{children}</SessionStatus>
    </SessionProvider>
  );
};

export const SessionStatus = ({ children }) => {
  const { status } = useSession();
  const { redirectToHome } = useAuthBroadcast();
  const { isLogging, setIsLogging, showModal, setShowModal } = useSessionStore();
  const pathname = usePathname();
  const isClient = useIsClient();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  useEffect(() => {
    if (isClient && from === "error") {
      toast.error("Necesitas iniciar sesión para acceder a esa página.");
    }
  }, [isClient, from]);

  useEffect(() => {
    if (isLogging) {
      const logoutReason = sessionStorage.getItem("logoutReason");

      if (logoutReason === "manual") {
        redirectToHome();
      } else {
        setShowModal(true);
      }
      setIsLogging(false); // Evita el bucle estableciendo isLogging en false
    }
  }, [isLogging, redirectToHome, setShowModal]);

  if (status === "loading") {
    return <div> Cargando </div>
  }

  if (status === "authenticated" && pathname === "/auth/login" && !showModal) {
    return <div> Estas logueandote </div>
  }

  return (
    <>
      <SessionModal isOpen={showModal} />
      {children}
    </>
  );
};