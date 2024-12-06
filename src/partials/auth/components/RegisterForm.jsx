"use client";
// Next
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Hooks
import { useState } from 'react';

export default function RegisterForm() {
  const router = useRouter();
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
      setTimeout(() => router.push('/auth/login'), 2000); 
    } else {
      setMessage(data.message || 'Error en el registro');
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen  font-sans">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl text-gray-800 mb-4 text-center">Registro</h2>
          {message && (
            <p className="text-red-500 mb-4 text-center">{message}</p>
          )}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="lastname"
              placeholder="Apellido"
              value={formData.lastname}
              onChange={handleChange}
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="usuario"
              placeholder="Usuario"
              value={formData.usuario}
              onChange={handleChange}
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Registrarse
            </button>
            <p className="mt-4 text-center">
              ¿Ya tienes cuenta?{""}
              <Link href="/" className="text-purple-600 hover:underline">
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}