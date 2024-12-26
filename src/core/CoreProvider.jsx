"use client";
// Components
import SessionModal from "@/src/partials/auth/components/SessionModal";
// Hooks
import { useIsClient } from "@uidotdev/usehooks";
import { useSessionDecision } from "@/src/hooks/useSessionDecision";
// Next
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
// React
import { useEffect } from "react";
// Store
import { useSessionStore } from "@/src/stores/sessionStore";
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
  const { handleHome } = useSessionDecision();
  const { isLogging, setIsLogging, showModal, setShowModal } = useSessionStore();
  const pathname = usePathname();
  const router = useRouter();
  const isClient = useIsClient();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  useEffect(() => {
    if (!isClient) return;

    const logoutReason = sessionStorage.getItem("logoutReason");

    if (from === "error") {
      toast.error("Necesitas iniciar sesión para acceder a esa página.");
      const params = new URLSearchParams(searchParams.toString());
      params.delete("from");
      router.replace(`${pathname}?${params.toString()}`);
    }

    if (isLogging && logoutReason === "manual") {
      handleHome();
      setIsLogging(false);
      return;
    }

    if (isLogging && logoutReason !== "manual") {
      setShowModal(true);
      setIsLogging(false);
      return;
    }

    if (pathname !== "/auth/login" && showModal) {
      handleHome();
    }
  }, [isClient, from, isLogging, pathname, showModal]);

  if (status === "loading") {
    return <div> Cargando </div>
  }

  if (status === "authenticated" && pathname === "/auth/login" && !showModal) {
    return <div> Estas logueandote </div>
  }

  return (
    <>
      <SessionModal isOpen={showModal}/>
      {children}
    </>
  );
};