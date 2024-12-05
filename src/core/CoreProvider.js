"use client";

/* Next */
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";


export const CoreProvider = ({ children }) => {
  return (
    <SessionProvider refetchInterval={1 * 60} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  );
};

export const SessionStatus = ({ children }) => {

  const { status } = useSession();
  const pathname = usePathname();
  const { router } = useRouter();

  // Mostrar animación de carga mientras se verifica la sesión
  if (status === "unauthenticated" && pathname !== "/auth/login" && pathname !== "/auth/register") {
    router.push("/auth/login");
  }

  return (
    <>
      {children}
    </>
  );
};