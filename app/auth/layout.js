// app/auth/layout.js
"use client";
// Components
import Navbar from "@/src/layouts/nav/Navbar";
// Hooks
import { useIsClient } from "@uidotdev/usehooks";
// Next
import { usePathname, useRouter, useSearchParams } from "next/navigation";
// React
import { useEffect } from "react";
// Store
import { useCaptchaStore } from "@/src/stores/captchaStore";
// Toast
import toast from "react-hot-toast";

export default function AuthLayout({ children }) {
  const isClient = useIsClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parámetro "from" de la URL
  const from = searchParams.get("from");

  useEffect(() => {
    // Si venimos de un error
    if (isClient && from === "error") {
      toast.error("Necesitas iniciar sesión para acceder a esa página.");
      const params = new URLSearchParams(searchParams.toString());
      params.delete("from"); // quitamos el "from" para limpiar la url
      router.replace(`${pathname}?${params.toString()}`);
      return;
    }
  }, [from, isClient, searchParams, router, pathname]);

  const isRegister = pathname === "/auth/register";
  const { setShowModal } = useCaptchaStore();

  useEffect(() => {
    setShowModal(true);
  }, [setShowModal]);

  return (
    <div
      className={`min-h-screen transition-colors ease-in-out duration-500 
      ${isRegister ? "bg-purple-dark" : "bg-lavender-pale"}`}
    >
      <Navbar
        color={isRegister ? "bg-lavender" : "bg-indigo-loud"}
        color2={isRegister ? "bg-indigo-loud" : "bg-lavender"}
        shadow={isRegister ? "shadow-lavender/50" : "shadow-indigo-loud/50"}
        shadow2={isRegister ? "shadow-indigo-loud/50" : "shadow-lavender/50"}
        imageSrc={isRegister ? "/assets/loudred-logo3.png" : "/assets/loudred-logo4.png"}
      />
      <main className="pt-16 md:pt-0 px-4">{children}</main>
    </div>
  );
}
