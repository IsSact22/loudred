"use client";
// Hooks
import { useForm, FormProvider } from "react-hook-form";
// Next
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Components
import Input from "@/src/components/inputs/Input";
import PasswordInput from "@/src/components/inputs/PasswordInput";
import StartButton from "@/src/components/buttons/StartButton";
// Validations
import {yupResolver} from "@hookform/resolvers/yup"
import { validationSchema } from "@/src/validations/validationSchema";
// Toast
import toast from 'react-hot-toast';

export default function LoginForm() {
  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integra Yup con react-hook-form
  });
  const { handleSubmit } = methods; // Extrae métodos de react-hook-form
  const router = useRouter();

  const onSubmit = async (data) => {
    const result = await signIn("credentials", {
      redirect: false,
      usuario: data.usuario,
      password: data.password,
    });

    if (result?.error) {
      toast.error(result.error);
    } else {
      router.replace("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-gradient-to-br from-purple-dark to-purple-darker p-8 rounded-2xl shadow-md min-h-[600px] min-w-[600px]">
        <h2 className="text-4xl font-bold text-white mb-12 ml-1">Bienvenido</h2>
        {/* FORMULARIO DE LOGIN */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Input para el usuario */}
            <Input
              name="usuario"
              label="Usuario"
              labelClass="text-white"
              placeholder="Ingrese su usuario"
              containerClass="mb-4"
            />

            {/* Input para la contraseña */}
            <PasswordInput
              name="password"
              label="Contraseña"
              labelClass="text-white"
              placeholder="Ingrese su contraseña"
              containerClass="mb-20 mt-10"
            />

            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Iniciar sesión
            </button>
            <p className="mt-4 text-center text-white font-bold">
              ¿No tienes cuenta?{" "}
              <Link
                href="/auth/register"
                className="text-red-500 hover:underline"
              >
                Registrar
              </Link>
            </p>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
