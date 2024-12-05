"use client";
// Hooks
import { useForm } from "react-hook-form";
// Next
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    const result = await signIn("credentials", {
      redirect: false,
      usuario: data.usuario,
      password: data.password,
    });

    if (result?.error) {
      alert(result.error); // Puedes personalizar la gestión del error
    } else {
      router.replace("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl text-gray-800 mb-4 text-center">
          Iniciar Sesión
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Usuario"
              {...register("usuario", {
                required: "El usuario es obligatorio",
              })}
              className={`w-full p-3 border rounded focus:outline-none ${
                errors.usuario
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {errors.usuario && (
              <p className="text-red-500 text-sm mt-1">
                {errors.usuario.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Contraseña"
              {...register("password", {
                required: "La contraseña es obligatoria",
              })}
              className={`w-full p-3 border rounded focus:outline-none ${
                errors.password
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Iniciar sesión
          </button>
          <p className="mt-4 text-center">
            ¿No tienes cuenta?{" "}
            <a
              href="/auth/register"
              className="text-purple-600 hover:underline"
            >
              Registrar
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
