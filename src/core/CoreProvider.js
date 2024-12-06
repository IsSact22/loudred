"use client";

/* Next */
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter} from "next/navigation"

export const CoreProvider = ({ children }) => {
  return (
    <SessionProvider refetchInterval={1 * 60} refetchOnWindowFocus={true}>
      <SessionStatus>{children}</SessionStatus>
    </SessionProvider>
  );
};

export const SessionStatus = ({ children }) => {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  if (status === "loading") {
    return <div>Cargando</div>;
  }

  // Si no hay sesión y no estás ya en el login o register, te redirige a la página del signIn
  if (
    status === "unauthenticated" &&
    pathname !== "/auth/login" &&
    pathname !== "/auth/register"
  ) {
    router.push("/auth/login");
    return null; // Evitar que se renderice el children mientras redirige
  }

  return <>{children}</>;
};