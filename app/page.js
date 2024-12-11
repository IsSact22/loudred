"use client";
// Animations
import { Heaven } from "@/src/animations/Heaven";
// Hooks
import { useData } from "@/src/hooks/useData";
// Next
import { useSession, signOut } from "next-auth/react";
// React
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const { data: categories, isLoading, error } = useData("/songs/categories");

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    artista: "",
    categoria: "",
    status: "",
  });
  const [message, setMessage] = useState("");

  // Usar directamente el rol desde la sesión
  const userRoleName = session?.user?.role?.name;

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/canciones", {
        method: "POST",
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

  // Prueba de carga y error de datos
  // if (isLoading) {
  //   return <Heaven />;
  // }

  // console.log(error?.response.data.message);

  return (
    <>
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
