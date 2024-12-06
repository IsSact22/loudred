"use client";
// Hooks
import { useForm, FormProvider } from "react-hook-form";
// Next
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
//Components
import Input from "@/src/components/inputs/Input";
import PasswordInput from "@/src/components/inputs/PasswordInput";
//Validations
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

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();
  // const router = useRouter();

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
      <div className="bg-white p-8 rounded-lg shadow-md min-h-[400px] min-w-[400px]">
        <h2 className="text-2xl text-gray-800 mb-4 text-center">
          Iniciar Sesión
        </h2>
         {/* FORMULARIO DE LOGIN */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Input para el usuario */}
            <Input
              name="usuario"
              label="Usuario"
              placeholder="Ingrese su usuario"
              containerClass="mb-4"
            />

            {/* Input para la contraseña */}
            <PasswordInput
              name="password"
              label="Contraseña"
              placeholder="Ingrese su contraseña"
              containerClass="mb-4"
            />

            {/* <div className="mb-4">
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
            </div> */}
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
        </FormProvider>
      </div>
    </div>
  );
}
