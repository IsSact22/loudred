// app/auth/layout.js
"use client";
// Components
import Navbar from "@/src/layouts/nav/Navbar";
// Hooks
import { usePathname } from "next/navigation";

export default function AuthLayout({ children }) {
  const pathname = usePathname();
  const isRegister = pathname === "/auth/register";

  return (
    <div
      className={`min-h-screen transition-colors ease-in-out duration-700 
      ${isRegister ? "bg-purple-dark" : "bg-lavender-pale"}`}
    >
      <Navbar color={isRegister ? "bg-lavender" : "bg-indigo-loud"} shadow={isRegister ? "shadow-lavender/50" : "shadow-indigo-loud/50"}/>
      <main>{children}</main>
    </div>
  );
}