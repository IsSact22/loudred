"use client";
// Components
import Input from "@/src/components/inputs/Input";
import PasswordInput from "@/src/components/inputs/PasswordInput";
import StartButton from "@/src/components/buttons/StartButton";
// Hooks
import { useForm, FormProvider } from "react-hook-form";
// Next
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// React
import { useState } from "react";
// Toast
import toast from 'react-hot-toast';
// Validations
import {yupResolver} from "@hookform/resolvers/yup"
import { loginSchema } from "@/src/validations/validationSchema";

export default function LoginForm() {
  const router = useRouter();
  const methods = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });
  const { handleSubmit } = methods; // Extrae métodos de react-hook-form
  const [inputLoading, setInputLoading] = useState(false);

  const onSubmit = async (data) => {
    setInputLoading(true);
    setTimeout(() => setInputLoading(true), 250);
    try {
      console.log("Datos enviados:", data);
  
      const result = await signIn("credentials", {
        redirect: false,
        usuario: data.usuario,
        password: data.password,
      });
  
      console.log("Resultado de signIn:", result);
  
      if (result?.error) {
        toast.error(result.error);
        setInputLoading(false);
      } else {
        toast.success("Inicio de sesión exitoso");
        console.log("Redirigiendo a la página principal...");
        router.replace("/");
      }
    } catch (error) {

      console.error("Error en el proceso de inicio de sesión:", error.message);
      toast.error("Ocurrió un error inesperado. Intenta nuevamente.");
      setInputLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="bg-gradient-to-br from-purple-dark to-purple-darker p-8 rounded-2xl shadow-md min-h-[600px] min-w-[600px]">
        <h2 className="text-4xl font-bold text-white mb-10 ml-1">Bienvenido</h2>
        {/* FORMULARIO DE LOGIN */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Input para el usuario */}
            <Input
              name="usuario"
              label="Usuario"
              labelClass="text-white"
              placeholder="Ingrese su usuario"
              containerClass="mb-10"
            />

            {/* Input para la contraseña */}
            <PasswordInput
              name="password"
              label="Contraseña"
              labelClass="text-white"
              placeholder="Ingrese su contraseña"
              containerClass="mb-10"
            />

            <div className="mx-44">
              <StartButton
                text="Iniciar sesión"
                type="submit"
                inputLoading={inputLoading}
                disabled={inputLoading}
                padding="p-4"
                margin="mb-10"
              />
            </div>

            {/* Link para registrar */}
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
