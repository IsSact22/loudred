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
import { loginSchema } from "@/src/validations/validationSchema";
// Toast
import toast from 'react-hot-toast';

export default function LoginForm() {
  const router = useRouter();
  const methods = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });
  const { handleSubmit } = methods; // Extrae métodos de react-hook-form
  

  const onSubmit = async (data) => {
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
      } else {
        toast.success("Inicio de sesión exitoso");
        console.log("Redirigiendo a la página principal...");
        router.replace("/");
      }
    } catch (error) {

      console.error("Error en el proceso de inicio de sesión:", error.message);
      toast.error("Ocurrió un error inesperado. Intenta nuevamente.");
    }
  };
  
  


  return (
    <div className="flex flex-col items-center justify-center ">
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
