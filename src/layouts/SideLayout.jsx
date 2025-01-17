"use client";
import SidebarLeft from "../components/bars/SidebarLeft";
import SidebarRight from "../components/bars/SidebarRight";
import { usePathname } from "next/navigation";

export default function SideLayout({ children }) {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");

  return (
    <div className="flex h-screen overflow-hidden">
      {!isAuthRoute && (
        <>
          {/* Sidebar izquierdo */}
          <div className="w-64 bg-slate-950 fixed left-0 top-0 bottom-0 z-10">
            <SidebarLeft />
          </div>
        </>
      )}
      <div
        className={`flex-1 ${
          !isAuthRoute ? "ml-64" : ""
        } ${!isAuthRoute ? "mr-64" : ""} relative overflow-y-auto`}
      >
        {children}
      </div>
      {!isAuthRoute && (
        <>
          {/* Sidebar derecho */}
          <div className="w-64 bg-slate-950 fixed right-0 top-0 bottom-0 z-10">
            <SidebarRight />
          </div>
        </>
      )}
    </div>
  );
}
