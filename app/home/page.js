"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/src/layouts/nav/Navbar";

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
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();
   // Obtener el rol del usuario basado en su ID
   useEffect(() => {
    const fetchUserRole = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/getUserRole?id=${session.user.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();

          if (response.ok) {
            console.log("Role del usuario:", data.role); // Verifica qué valor estás recibiendo
            setUserRole(data.role); // Asume que el valor que regresa es el rol
          } else {
            setMessage("Error al obtener el rol del usuario.");
          }
        } catch (error) {
          console.error("Error al obtener el rol del usuario:", error);
          setMessage("Error al obtener el rol del usuario.");
        }
      }
    };

    fetchUserRole();
  }, [session]);
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

  // Redirigir si no hay sesión
  useEffect(() => {
    if (!session) {
      router.push("/"); // Redirige al login si no hay sesión
    }
  }, [session, router]);

  if (!session) {
    return <p>Redirigiendo al login...</p>;
  }

  // Determinar si es superusuario
 // Verificar si el rol es SUPERADMIN
 const isSuperUser = userRole === "SUPERADMIN"; // Compara si el rol es SUPERADMIN


  return (
    <>
      <Navbar />
      <div>
        <h1>
          Bienvenido, {session.user.name} {isSuperUser ? "(SUPERADMIN)" : ""}
        </h1>

        {/* Botón para cerrar sesión */}
        <button onClick={() => signOut({ callbackUrl: "/" })}>Cerrar Sesión</button>

   {/* Mostrar contenido especial para superusuarios */}
   {isSuperUser && (
          <div>
            <h2>MAMALO CARLOS</h2>
            {/* Funcionalidades específicas para superusuarios */}
          </div>
        )}

        {userRole === "USER" && null} {/* No muestra nada si es un usuario normal */}


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
