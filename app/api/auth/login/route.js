// app/api/auth/login/route.js
import db from '@/app/lib/db';  // Ruta correcta de db
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'tu_secreto_super_secreto';

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ message: 'Todos los campos son obligatorios' }), { status: 400 });
  }

  try {
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (user.length === 0) {
      return new Response(JSON.stringify({ message: 'Credenciales incorrectas' }), { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, user[0].password);

    if (!validPassword) {
      return new Response(JSON.stringify({ message: 'Credenciales incorrectas' }), { status: 401 });
    }

    const token = jwt.sign({ id: user[0].id, name: user[0].name }, SECRET_KEY, {
      expiresIn: '1h',
    });

    return new Response(JSON.stringify({ message: 'Login exitoso', token }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error en el servidor', error: error.message }), { status: 500 });
  }
}
