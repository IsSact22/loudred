"use client";
// Components
import Input from "@/src/components/inputs/Input";
import PasswordInput from "@/src/components/inputs/PasswordInput";
import StartButton from "@/src/components/buttons/StartButton";
import UploadInput from "@/src/components/inputs/UploadInput";
// Next
import { useRouter } from "next/navigation";
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
  const userId = session?.user?.id;

  const methods = useForm({
    resolver: yupResolver(updateSchema),
    mode: "onChange",
    defaultValues: {
      name: session?.user?.name,
      lastname: session?.user?.lastname,
      password: "",
      confirmPassword: "",
      avatar: null,
    },
  });

  const { handleSubmit, setValue, watch } = methods;
  const { createData, isMutating } = useData(`/admin/users/${userId}`, {}, false);

  const onSubmit = async (formData) => {
    try {
      const formDataObj = new FormData();
      let hasChanges = false;

      // Campos a verificar
      const fieldsToCheck = {
        name: session?.user?.name,
        lastname: session?.user?.lastname,
        password: "",
        avatar: null,
      };

      // Construir FormData solo con cambios
      for (const [key, value] of Object.entries(formData)) {
        if (key === "confirmPassword") continue;

        const currentValue =
          key === "avatar" ? formData[key] : formData[key]?.trim();
        const originalValue = fieldsToCheck[key];

        if (currentValue && currentValue !== originalValue) {
          if (key === "avatar" && currentValue instanceof File) {
            formDataObj.append(key, currentValue); // Solo si es un archivo
            
          } else {
            formDataObj.append(key, currentValue);
          }
          hasChanges = true;
        }
      }

      formDataObj.append("avatar", formData.avatar?.[0] || "");

      if (!hasChanges) {
        toast.error("No hay cambios que actualizar.");
        return;
      }

      // Enviar todo en una sola petición
      await createData(formDataObj, userId);

      toast.success("Perfil actualizado exitosamente");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(error.message || "Error al actualizar el perfil");
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
            <UploadInput
              name="avatar"
              label="Avatar"
              labelClass="text-purple-900 flex"
              accept="image/png, image/jpeg, image/webp"
              maxSize={10 * 1024 * 1024}
              containerClass="mb-6"
              className="text-purple-900"
              onChange={(e) => setValue("avatar", e.target.files[0])}
            />
            <div className="flex gap-4 mb-4">
              <Input
                name="name"
                label="Nombre"
                labelClass="text-purple-900"
                placeholder="Ingresa tu nombre"
                containerClass="mb-6"
                className="bg-purple-200"
              />
              <Input
                name="lastname"
                label="Apellido"
                labelClass="text-purple-900"
                placeholder="Ingrese tu apellido"
                containerClass="mb-6"
                className="bg-purple-200"
              />
            </div>
            <PasswordInput
              name="password"
              label="Contraseña"
              labelClass="text-purple-700"
              placeholder="Ingrese su contraseña"
              containerClass="mb-6"
              className="bg-purple-200"
            />
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
