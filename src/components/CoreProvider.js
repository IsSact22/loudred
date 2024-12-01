"use client";

/* Next */
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";


export const CoreProvider = ({ children }) => {
  return (
    <SessionProvider>
      <SessionStatus>{children}</SessionStatus>
    </SessionProvider>
  );
};

export const SessionStatus = ({ children }) => {

  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Mostrar animación de carga mientras se verifica la sesión
  if (status === "loading") {
    return <div>cargando</div>
  }

  return (
    <>
      {children}
    </>
  );
};