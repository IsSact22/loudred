"use client";
// Components
import Input from "@/src/components/inputs/Input";
import PasswordInput from "@/src/components/inputs/PasswordInput";
import StartButton from "@/src/components/buttons/StartButton";
// Hooks
import { useForm, FormProvider } from "react-hook-form";
// Next
import Link from "next/link";
// Store
import { useSessionStore } from "@/src/stores/sessionStore";
// Toast
import toast from "react-hot-toast";
// Utils
import { broadcastLogin } from "@/src/utils/authChannel";
// Validations
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/src/validations/validationSchema";

export default function LoginForm() {
  // Inicializar react-hook-form con Yup
  const methods = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });
  const { handleSubmit } = methods; // Extrae métodos de react-hook-form
  const { isLogging, setIsLogging } = useSessionStore();

  const onSubmit = async (data) => {
    setIsLogging(true);
    const result = await broadcastLogin({
      username: data.username,
      password: data.password,
    });

    if (result?.error) {
      toast.error(result.error || "Oops, credenciales inválidas.");
      setIsLogging(false);
    } else {
      // Limpiamos la razón del logout del sessionStorage
      sessionStorage.removeItem("logoutReason");
    }
  };

  const onError = (errors) => {
    const mensajes = Object.values(errors)
      .map((error) => error.message)
      .join(", ");
    toast.error(`Error: ${mensajes}`);
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col mt-14 p-10 bg-gradient-to-br from-purple-dark to-purple-darker rounded-2xl shadow-md">
          <h2 className="text-4xl font-bold text-white mb-10 ml-1">
            Bienvenido
          </h2>
          {/* FORMULARIO DE LOGIN */}
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="flex flex-col"
            >
              {/* Input para el usuario */}
              <Input
                name="username"
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

              <div className="mx-44 mb-10">
                <StartButton
                  text="Iniciar sesión"
                  type="submit"
                  isLoading={isLogging}
                  disabled={isLogging}
                  className="p-4"
                />
              </div>

              {/* Link para registrar */}
              <p className="text-center text-white font-bold">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/auth/register"
                  className="text-red-500 hover:underline"
                >
                  Regístrate
                </Link>
              </p>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}
