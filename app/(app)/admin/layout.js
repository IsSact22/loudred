import Link from "next/link";
import React from "react";
import { TbPasswordUser } from "react-icons/tb";

export default function AdminLayout({ children }) {
  return (
    <div className="darkMode bg-gray-900 text-white min-h-screen">
      <nav className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-12">
            <div className="flex w-full">
              <div className="flex items-center gap-2 w-full">
                <TbPasswordUser className="text-xl"/>
                <span className="text-xl font-bold text-gray-800"> Admin</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/admin/users"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Usuarios
                </Link>
                <Link
                  href="/admin/verification"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Verificación
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}