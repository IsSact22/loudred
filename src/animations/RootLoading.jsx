"use client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function RootLoading({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return <div>Cargando</div>;
  }

  if (pathname.startsWith("/auth")) {
    if (session) {
      return children;
    }
  } else {
    if (session && session.user) {
      return children;
    }
  }

  return null;
}