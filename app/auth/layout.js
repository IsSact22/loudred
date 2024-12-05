// app/auth/layout.js
"use client";
//Components
import Navbar from "@/src/layouts/nav/Navbar";
// Hooks
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/src/stores/authStore";

export default function AuthLayout({ children }) {
  const pathname = usePathname();
  const { isLogin, setIsLogin } = useAuthStore();

  return (
    <div className="">
      <Navbar />
      <p>Ruta actual: {pathname}</p>
      <main>{children}</main>
    </div>
  );
}