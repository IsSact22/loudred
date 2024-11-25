// components/RegisterForm.js
"use client";


import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Usa next/navigation
import '@/styles/globals.css';
import Navbar from '@/components/header';



export default function Register() {
  const router= useRouter();
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    usuario: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    

    const data = await res.json();

    if (res.ok) {
      setMessage('Registro exitoso');
      
      setTimeout(() => router.push('/login'), 2000); 
    } else {
      setMessage(data.message || 'Error en el registro');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="formWrapper">
          <h2 className="title">Registro</h2>
          {message && <p className="message">{message}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              type="text"
              name="lastname"
              placeholder="Apellido"
              value={formData.name}
              onChange={handleChange}
              required
              className="input"
            />
            <input
              type="usuario"
              name="usuario"
              placeholder="Usuario"
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
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="input"
            />
            <button type="submit" className="button">Registrarse</button>
            <p className="link">
              ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
