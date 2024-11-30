
"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react"; // Importa signOut
import { useRouter } from "next/navigation"; // Importa useRouter
import Navbar from "@/components/header";

export default function Home() {
  const { data: session } = useSession(); // Obtener la sesión del usuario
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    artista: "",
    categoria: "",
    status: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Reseteamos el mensaje de error

    try {
      const response = await fetch("/api/canciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en la API");
      }

      const data = await response.json();
      setMessage("Canción registrada correctamente");
      setFormData({ nombre: "", artista: "", categoria: "", status: "" }); // Resetear formulario
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setMessage(error.message || "Error al registrar la canción");
    }
  };

  // Redirigir si no hay sesión, pero usando useEffect para evitar el error
  useEffect(() => {
    if (!session) {
      router.push("/login"); // Redirige al login si no está autenticado
    }
  }, [session, router]); // Dependencias: se ejecuta cuando cambia la sesión

  if (!session) {
    return <p>Redirigiendo al login...</p>; // Mostrar mensaje de redirección
  }

  return (
    <>
      <Navbar />
      <div>
        <h1>Bienvenido a la página principal, {session.user.name}</h1>
        
        {/* Botón para cerrar sesión */}
        <button onClick={() => signOut({ callbackUrl: "/login" })}>Cerrar Sesión</button>

        <button onClick={() => setShowModal(true)}>Subir Canción</button>

        {showModal && (
          <div className="modal">
            <form onSubmit={handleSubmit}>
              <h2>Subir Canción</h2>
              <label>
                Nombre:
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Artista:
                <input
                  type="text"
                  value={formData.artista}
                  onChange={(e) =>
                    setFormData({ ...formData, artista: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Categoría:
                <input
                  type="text"
                  value={formData.categoria}
                  onChange={(e) =>
                    setFormData({ ...formData, categoria: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Estado:
                <input
                  type="text"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  required
                />
              </label>
              <button type="submit">Registrar Canción</button>
              <button onClick={() => setShowModal(false)}>Cancelar</button>
            </form>
          </div>
        )}

        {message && <p>{message}</p>}
      </div>
    </>
  );
}
