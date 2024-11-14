// components/loginForm.js
"use client";

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

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('Login exitoso');
      router.push('/home');
    } else {
      setMessage(data.message || 'Error en el login');
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
