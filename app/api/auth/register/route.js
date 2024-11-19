import db from "@/app/lib/db"; // Ruta correcta de db
import bcrypt from "bcryptjs";

function validacionInput({name, email, password, confirmPassword}){
  if (!name, !email, !password, !confirmPassword){
    return "Todos los campos son necesarios";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)){
    return "El email no es válido";
  }
  if (password!==confirmPassword){
    return "Las contraseñas no coincide"
  }

  if(!IsStrongPassword(password)){
    return "La contraseña no es fuerte, debe tener 8 caracteres, una mayúscula, una minúscula y un número";
  }
  return null; //No errores
}

//fortaleza de contraseña
function IsStrongPassword(password){
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return strongPasswordRegex.test(password);
}

// función asíncrona 

export async function POST(req){

  try {
    // Parsear y validar la entrada
    const { name, email, password, confirmPassword } = await req.json();

    const validationError = validacionInput({ name, email, password, confirmPassword });
    if (validationError) {
      return new Response(
        JSON.stringify({ message: validationError }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verificar si el usuario ya existe
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return new Response(
        JSON.stringify({ message: "El usuario ya existe" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // Crear el usuario con contraseña encriptada
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return new Response(
      JSON.stringify({ message: "Usuario registrado exitosamente" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error interno:", error);
    return new Response(
      JSON.stringify({
        message: "Error interno del servidor",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }






}