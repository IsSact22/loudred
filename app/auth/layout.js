// app/auth/layout.js
"use client";
// Components
import Navbar from "@/src/layouts/nav/Navbar";
// Next
import { usePathname } from "next/navigation";
// React
import { useEffect } from "react";
// Store
import { useCaptchaStore } from "@/src/stores/captchaStore";

export default function AuthLayout({ children }) {
  const pathname = usePathname();
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
