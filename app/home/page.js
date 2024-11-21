// api/home/page.
"use client";
import Navbar from "@/components/header";
export default function Home() {
    return (
        <>
      <Navbar /> {/* Coloca el Navbar al inicio de la página */}
      <div>
        <h1>Bienvenido a la página principal</h1>
        <p>Has iniciado sesión correctamente.</p>
      </div>
  </>
    );
  }