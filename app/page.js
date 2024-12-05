"use client";
// Components
import Navbar from "@/src/layouts/nav/Navbar";
// Hooks
import {useState, useEffect} from "react";
// Next
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    artista: "",
    categoria: "",
    status: "",
  });
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  // Usar directamente el rol desde la sesión
  const userRoleName = session?.user?.role?.name;

  // Obtener categorías
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
          setCategories(data);
        } else {
          setMessage("Error al cargar categorías.");
        }
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        setMessage("Error al cargar categorías.");
      }
    };

    fetchCategories();
  }, []);

  // Manejar el envío del formulario
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

      setMessage("Canción registrada con éxito.");
      setShowModal(false);
      setFormData({ nombre: "", artista: "", categoria: "", status: "" });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setMessage("Error inesperado. Por favor, inténtalo más tarde.");
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <h1>
          Bienvenido, {session?.user.name}{" "}
          {userRoleName === "SUPERADMIN" ? "(SUPERADMIN)" : ""}
        </h1>

        {/* Botón para cerrar sesión */}
        <button onClick={() => signOut({ callbackUrl: "/auth/login" })}>
          Cerrar Sesión
        </button>

        {userRoleName === "SUPERADMIN" && (
          <div>
            <h2>Me la pelan somos arrecho</h2>
            {/* Opciones o funcionalidades */}
          </div>
        )}

        {userRoleName === "USER" && (
          <div>
            <h2>Bienvenido, webones proveedores de nuestra locura .</h2>
            {/* Opciones o funcionalidades específicas para el rol USER */}
          </div>
        )}

        <button onClick={() => setShowModal(true)}>Subir Canción</button>

        {showModal && (
          <div className="modal">
            <form onSubmit={handleSubmit}>
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
              <button type="button" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
            </form>
          </div>
        )}

        {message && <p>{message}</p>}
      </div>
    </>
  );
}
