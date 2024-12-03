"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    usuario: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      usuario: formData.usuario,
      password: formData.password,
    });

    if (result?.error) {
      setMessage(result.error);
    } else {
      router.push("/home");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl text-gray-800 mb-4 text-center">Iniciar Sesión</h2>
          {message && <p className="text-red-500 mb-4 text-center">{message}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="usuario"
              placeholder="Usuario"
              value={formData.usuario}
              onChange={handleChange}
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Iniciar sesión
            </button>
            <p className="mt-4 text-center">
              ¿No tienes cuenta? <a href="/auth/register" className="text-purple-600 hover:underline">Registrar</a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}