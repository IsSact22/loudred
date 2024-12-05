// app/auth/layout.js
"use client";
//Components
import Navbar from "@/src/layouts/nav/Navbar";
// Hooks
import {useEffect} from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/src/stores/authStore";

export default function AuthLayout({ children }) {
  const pathname = usePathname();
  const { isLogin, setIsLogin } = useAuthStore();

  //Se utiliza esta funcion para cambiar el estado en base a la ruta o pathname
  useEffect(() => {

    if (pathname === "/auth/login") {
      setIsLogin(true);
    } else if (pathname === "/auth/register") {
      setIsLogin(false);
    }
  }, [pathname, setIsLogin]);

  return (
    <div className={`min-h-screen  transition-colors ease-in-out duration-700 
      ${ isLogin ? "bg-purple-login" : "bg-purple-register"}`
      }>
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        
        <main>{children}</main>
      </div>
    </div>
  );
}