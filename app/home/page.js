// //api/home/page.
// "use client";
// import Navbar from "@/components/header";

// export default function Home() {
//     return (
//         <>
//       <Navbar /> {/* Coloca el Navbar al inicio de la página */}
//       <div>
//         <h1>Bienvenido a la página principal</h1>
//         <p>Has iniciado sesión correctamente.</p>
//       </div>
//   </>
//     );
//   }


// app/home/page.js
"use client";
import { useState } from "react";
import Navbar from "@/components/header";

import { useSession } from "next-auth/react";

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

  if (!session) {
    return <p>No estás autenticado. Por favor, inicia sesión.</p>;
  }

  return (
    <>
      <Navbar />
      <div>
        <h1>Bienvenido a la página principal</h1>
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
