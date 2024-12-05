"use client"
import { useSession } from "next-auth/react";

export default function RootLoading() {
  const { status } = useSession();
  if (status === "loading") {
    return <div> Cargando </div>;
  }
  return null;
}
