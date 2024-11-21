// components/loginForm.js
"use client";
import { signIn } from 'next-auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Usa next/navigation
import '@/styles/globals.css'; // Importa los estilos globales
import Navbar from '@/components/header';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Llama al método signIn con el proveedor "credentials"
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res.error) {
      // Maneja el error de autenticación
      setError(res.error);
    } else {
      // Autenticación exitosa, redirige al usuario
      router.push('/home'); // Cambia '/dashboard' por la ruta que desees
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
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
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
            <button type="submit" className="button">Iniciar sesión</button>
            <p className="link">¿Ya tienes cuenta? <a href="/register">Registrar</a></p>
          </form>
        </div>
      </div>
    </>
  );
}
