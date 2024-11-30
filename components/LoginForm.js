"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/header";
import "@/styles/globals.css";

export default function Login() {
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
      <Navbar />
      <div className="container">
        <div className="formWrapper">
          <h2 className="title">Iniciar Sesión</h2>
          {message && <p className="message">{message}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="usuario"
              placeholder="Usuario"
              value={formData.usuario}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              className="input"
            />
            <button type="submit" className="button">
              Iniciar sesión
            </button>
            <p className="link">
              ¿No tienes cuenta? <a href="/register">Registrar</a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
