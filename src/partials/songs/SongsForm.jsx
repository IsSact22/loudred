"use client";
// Components
import Input from "@/src/components/inputs/Input";
import UploadInput from "@/src/components/inputs/UploadInput";
import StartButton from "@/src/components/buttons/StartButton";
import CategorySelect from "@/src/components/select/CategoriesSelect";
// Hooks
import { useForm, FormProvider } from "react-hook-form";
import { useData } from "@/src/hooks/useData";
import { useSession } from "next-auth/react";
// Validations
import { yupResolver } from "@hookform/resolvers/yup";
import { songsSchema } from "@/src/validations/validationSchema";
// Toast
import toast from 'react-hot-toast';

export default function SongsForm() {
  const { data: session } = useSession();

  const methods = useForm({
    resolver: yupResolver(songsSchema),
    mode: "onChange",
    defaultValues: {
      artist: session?.user?.name || "",
    },
  });
  const { handleSubmit } = methods; // Extrae métodos de react-hook-form
  const { createData, isMutating: isLoading } = useData("/songs", {}, true);

  const onSubmit = async (data) => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("userId", session?.user?.id);
    formData.append("categoryId", data.category?.id || "");
    formData.append("music", data.audio?.[0] || "");
    formData.append("image", data.cover?.[0] || "");

    await createData(formData); // Ajusta createData para multipart/form-data
    toast.success("Canción subida con éxito");
    //onClose?.();
  } catch (error) {
    console.error(error);
  }
};

  const onError = (errors) => {
    const mensajes = Object.values(errors)
      .map((error) => error.message)
      .join(", ");
    toast.error(`Errores: ${mensajes}`);
  };

  return (
    <div className="relative z-50 flex flex-col items-center justify-center">
      <div className="bg-gradient-to-br from-purple-200 to-purple-300 p-8 rounded-2xl shadow-md min-h-[600px] min-w-[700px]">
        <h2 className="text-4xl font-bold text-purple-900 mb-10 ml-1">Añade la información</h2>
        
        {/* FORMULARIO DE SUBIR CANCIÓN */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col">

            {/* Input para el título de la canción */}
            <Input
              name="title"
              label="Título"
              labelClass="text-purple-900"
              placeholder="Ingrese el título de la canción"
              containerClass="mb-6"
              className="bg-purple-50"

            />

            {/* Input para el artista */}
            <Input
              name="artist"
              label="Artista"
              labelClass="text-purple-900"
              containerClass="mb-6"
              className="bg-purple-50"
              disabled={true}
            />

            {/* Seleccionar una categoria */}
            <CategorySelect
              name="category"
              label="Categoría"
              labelClass="text-purple-900"
              placeholder="Selecciona una categoría"
              containerClass="mb-6"
            />

            <div className="flex items-center justify-center gap-4 mb-4">
              {/* Input para el archivo de la canción */}
              <UploadInput
                name="audio"
                label="Canción"
                labelClass="text-purple-900 font-bold"
                accept="audio/mp3"
                maxSize={10 * 1024 * 1024} // 10MB
                containerClass="mb-6"
                className="text-purple-900"
              />

              {/* Input para el archivo de la portada */}
              <UploadInput
                name="cover"
                label="Portada"
                labelClass="text-purple-900"
                accept="image/png"
                maxSize={10 * 1024 * 1024} // 10MB
                containerClass="mb-6"
                className="text-purple-900"

              />
            </div>

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
