"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react"; // Importa signOut
import { useRouter } from "next/navigation"; // Importa useRouter
import Navbar from "@/src/layouts/nav/Navbar";

export default function Home() {
  const { data: session } = useSession(); // Obtener la sesión del usuario
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    artista: "",
    categoria: "",
    status: "",
  });
  const [categories, setCategories] = useState([]); // Para almacenar las categorías
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Obtener las categorías cuando la vista se cargue
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/getCategories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          setCategories(data); // Almacena las categorías en el estado
        } else {
          setMessage("Error al cargar categorías.");
        }
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        setMessage("Error al cargar categorías.");
      }
    };

    fetchCategories(); // Llamar la función cuando la vista se monte
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/canciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`, // Enviar el token en el header
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json(); // Procesar la respuesta del servidor

      if (!response.ok) {
        if (response.status === 409) {
          // Manejar canción duplicada
          setMessage("Error: La canción ya existe.");
        } else {
          // Manejar otros errores
          setMessage(`Error: ${data.error || "Error inesperado"}`);
        }
        return;
      }

      // Si se registra correctamente
      setMessage("Canción subida con éxito.");
      setShowModal(false); // Cierra el modal
      setFormData({ nombre: "", artista: "", categoria: "", status: "" }); // Limpia el formulario
      console.log("Canción registrada:", data);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setMessage("Error inesperado. Por favor, inténtalo más tarde.");
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
                <select
                  value={formData.categoria}
                  onChange={(e) =>
                    setFormData({ ...formData, categoria: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nombre}
                    </option>
                  ))}
                </select>
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
              <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
            </form>
          </div>
        )}

        {message && <p>{message}</p>}
      </div>
    </>
  );
}
