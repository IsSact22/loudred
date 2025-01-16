"use client";
import SidebarLeft from "../components/bars/SidebarLeft";
import SidebarRight from "../components/bars/SidebarRight";
import { usePathname } from 'next/navigation';

export default function SideLayout({ children }) {
    const pathname = usePathname();
    const isAuthRoute = pathname.startsWith('/auth');

    return (
        <>
            {!isAuthRoute && (
                <>
                    {/* Sidebar izquierdo */}
                    <div className="w-64">
                        <SidebarLeft />
                    </div>
                </>
            )}
            {children}
            {!isAuthRoute && (
                <>
                    {/* Sidebar derecho */}
                    <div className="w-64 bg-slate-800 fixed right-0 top-0 bottom-0">
                        <SidebarRight />
                    </div>
                </>
            )}
        </>
    )
}