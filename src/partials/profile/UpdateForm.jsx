"use client";
// Components
import Input from "@/src/components/inputs/Input";
import PasswordInput from "@/src/components/inputs/PasswordInput";
import StartButton from "@/src/components/buttons/StartButton";
import UploadInput from "@/src/components/inputs/UploadInput"; // Nuevo componente importado
// Next
import { useSession } from "next-auth/react";
// Hooks
import { useForm, FormProvider } from "react-hook-form";
import { useData } from "@/src/hooks/useData";
// Validations
import { yupResolver } from "@hookform/resolvers/yup";
import { updateSchema } from "@/src/validations/validationSchema";
// Toast
import toast from "react-hot-toast";

export default function UpdateForm() {
  const { data: session } = useSession();
  const userId = session.user.id;

  const methods = useForm({
    resolver: yupResolver(updateSchema),
    mode: "onChange",
    defaultValues: {
      name: session.user.name,
      lastname: session.user.lastname,
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit } = methods;
  // Cambiamos el tercer parámetro a true para enviar como multipart
  const { createData, isMutating } = useData(
    `/admin/users/${userId}`,
    {},
    false
  );

  const onSubmit = async (formDataValues) => {
    try {
      const filteredData = Object.fromEntries(
        Object.entries(formDataValues).filter(([key, value]) => {
          // Manejo especial para el avatar (archivo)
          if (key === "avatar") return value?.length > 0; // Conservar solo si hay archivo

          // Filtrado para otros campos
          if (!value || value.trim?.() === "") return false;
          if (session.user[key] && value.trim?.() === session.user[key])
            return false;
          return true;
        })
      );

      if (Object.keys(filteredData).length === 0) {
        toast.error("No hay cambios que actualizar.");
        return;
      }

      const formData = new FormData();

      // Convertimos los datos a FormData
      Object.entries(filteredData).forEach(([key, value]) => {
        if (key === "avatar") {
          formData.append(key, value[0]); // Tomamos el primer archivo
        } else {
          formData.append(key, value);
        }
      });

      await createData(formData, userId);
      toast.success("Perfil actualizado exitosamente");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(
        error.message || "Ocurrió un error inesperado. Intenta nuevamente."
      );
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
      <div className="flex flex-col bg-gradient-to-br from-white to-purple-100 p-8 rounded-2xl mt-10 shadow-md min-h-[600px] min-w-[600px]">
        <h2 className="text-4xl font-bold text-red-500 mb-10 ml-1">Ajustes</h2>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="flex flex-col"
          >
            {/* Nuevo input para avatar */}
            <div className="flex gap-4 mb-4">
              <UploadInput
                name="avatar"
                label="Avatar"
                labelClass="text-purple-900"
                accept="image/jpeg, image/png"
                maxSize={10 * 1024 * 1024} // 10MB
                containerClass="mb-6"
                className="text-purple-900"
              />
            </div>

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
                isLoading={isMutating}
                disabled={isMutating}
                padding="p-8"
              />
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
