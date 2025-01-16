" use client";
import SidebarLeft from "../components/bars/SidebarLeft";
import SidebarRight from "../components/bars/SidebarRight";

export default function SideLayout({ children }) {
    return (
        <>
          {/* Sidebar izquierdo */}
          <div className="w-64">
            <SidebarLeft />
          </div>
            {children}
          {/* Sidebar derecho */}
          <div className="w-64 bg-slate-800 fixed right-0 top-0 bottom-0">
            <SidebarRight />
          </div>
        </>
    )
}