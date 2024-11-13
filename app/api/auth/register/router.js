import db from '../../../lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { name, email, password, confirmPassword } = await req.json();

  if (!name || !email || !password || !confirmPassword) {
    return new Response(JSON.stringify({ message: 'Todos los campos son obligatorios' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (password !== confirmPassword) {
    return new Response(JSON.stringify({ message: 'Las contraseñas no coinciden' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return new Response(JSON.stringify({ message: 'El usuario ya existe' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      hashedPassword,
    ]);

    return new Response(JSON.stringify({ message: 'Usuario registrado exitosamente' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error al registrar el usuario', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
