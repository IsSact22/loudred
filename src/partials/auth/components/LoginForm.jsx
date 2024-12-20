"use client";
// Components
import Input from "@/src/components/inputs/Input";
import PasswordInput from "@/src/components/inputs/PasswordInput";
import StartButton from "@/src/components/buttons/StartButton";
import SessionModal from "@/src/partials/auth/components/SessionModal";
// Hooks
import { useForm, FormProvider } from "react-hook-form";
import { useIsClient } from "@uidotdev/usehooks";
import { useSessionDecision } from "@/src/hooks/useSessionDecision";
// Next
import Link from "next/link";
import { useSearchParams } from "next/navigation";
// React
import { useEffect } from "react";
// Store
import { useSessionStore } from "@/src/stores/sessionStore";
// Toast
import toast from "react-hot-toast";
// Utils
import { broadcastLogin, redirectToHome } from "@/src/utils/broadcastAuth";
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
  const { isLogging, setIsLogging, setIsDecided, showModal, setShowModal } = useSessionStore();
  const { handleRestore, handleHome } = useSessionDecision();
  const isClient = useIsClient();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  useEffect(() => {
    if (isClient && from === "error") {
      toast.error("Necesitas iniciar sesión para acceder a esa página.");
    }
  }, [isClient, from]);

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
      // Obtenemos la razón del cierre de sesión anterior
      const logoutReason = sessionStorage.getItem("logoutReason");

      if (logoutReason === "manual") {
        // Si fue manual, redirigimos directamente a inicio
        redirectToHome();
        setIsDecided(true);
      } else {
        // Si no, mostramos el modal de decisión
        setShowModal(true);
      }
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
      <SessionModal
        isOpen={showModal}
        onHome={handleHome}
        onRestore={handleRestore}
        closeModal={handleHome}
      />
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
