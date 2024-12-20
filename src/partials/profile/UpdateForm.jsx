"use client";
// Components
import Input from "@/src/components/inputs/Input";
import PasswordInput from "@/src/components/inputs/PasswordInput";
import StartButton from "@/src/components/buttons/StartButton";
// Next
import { useRouter } from "next/navigation";
// Hooks
import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";
// Validations
import { yupResolver } from "@hookform/resolvers/yup";
import { updateSchema } from "@/src/validations/validationSchema";
// Toast
import toast from 'react-hot-toast';

export default function UpdateForm({ userId }) {
  const router = useRouter();
  
  const methods = useForm({
    resolver: yupResolver(updateSchema),
    mode: "onChange",
  });
  const { handleSubmit } = methods;
  const [isLoading, setIsLoading] = useState(false);

  

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Manejar errores del backend
        toast.error(result.message || "Error al actualizar el perfil");
        return;
      }

      toast.success("Perfil actualizado exitosamente");
      setTimeout(() => {
        router.refresh(); // Recargar la página o redirigir si es necesario
      }, 1000);
    } catch (error) {
      toast.error(
        error.message || "Ocurrió un error inesperado. Intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (errors) => {
    const mensajes = Object.values(errors)
      .map((error) => error.message)
      .join(", ");
    toast.error(`Errores: ${mensajes}`);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col mt-14 bg-gradient-to-br from-white to-purple-100 p-8 rounded-2xl mt-10 shadow-md min-h-[600px] min-w-[600px]">
      <h2 className="text-4xl font-bold text-red-500 mb-10 ml-1">Ajustes</h2>
        
        {/* FORMULARIO DE ACTUALIZAR DATOS */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col">

            <div className="flex gap-4 mb-4">

              {/* Input para el nombre del usuario */}
              <Input
                name="name"
                label="Nombre"
                labelClass="text-purple-900"
                placeholder="Ingresa tu nombre"
                containerClass="mb-6"
                className="bg-purple-200"

              />

              {/* Input para el apellido del usuario */}
              <Input
                name="lastname"
                label="Apellido"
                labelClass="text-purple-900"
                placeholder="Ingrese tu apellido"
                containerClass="mb-6"
                className="bg-purple-200"
              />
            </div>


            {/* Contraseña */}
            <PasswordInput
              name="password"
              label="Contraseña"
              labelClass="text-purple-700"
              placeholder="Ingrese su contraseña"
              containerClass="mb-6"
              className="bg-purple-200"
            />

            {/* Confirmar contraseña */}
            <PasswordInput
              name="confirmPassword"
              label="Confirmar contraseña"
              labelClass="text-purple-700"
              placeholder="Confirme su contraseña"
              containerClass="mb-6"
              className="bg-purple-200"
            />

            <div className="mx-44">
              <StartButton
                text="Enviar"
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                padding="p-4"
              />
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
