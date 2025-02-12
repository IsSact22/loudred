"use client";
// Components
import SessionModal from "@/src/partials/auth/components/SessionModal";
// Hooks
import { useIsClient } from "@uidotdev/usehooks";
import { useSessionDecision } from "@/src/hooks/useSessionDecision";
// Next
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
// React
import { useEffect } from "react";
// Store
import { useSessionStore } from "@/src/stores/sessionStore";

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
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;

    const logoutReason = sessionStorage.getItem("logoutReason");

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
  }, [isClient, isLogging, pathname, showModal]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center text-center w-full min-h-screen bg-black">
        <span className="refreshLoader"></span>
      </div>
    );
  }

  if (status === "authenticated" && pathname === "/auth/login" && !showModal) {
    return (
      <div className="flex justify-center items-center text-center w-full min-h-screen bg-black">
        <span className="accessLoader"></span>
      </div>
    );
  }

  return (
    <>
      <SessionModal isOpen={showModal}/>
      
      {children}
    </>
  );
};