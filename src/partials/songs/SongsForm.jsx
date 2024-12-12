"use client";
// Components
import Input from "@/src/components/inputs/Input";
import UploadInput from "@/src/components/inputs/UploadInput";
import StartButton from "@/src/components/buttons/StartButton";
// Hooks
import { useForm, FormProvider } from "react-hook-form";
// Validations
import { yupResolver } from "@hookform/resolvers/yup";
import { songsSchema } from "@/src/validations/validationSchema";
// Toast
import toast from 'react-hot-toast';

export default function SongsForm() {
  const methods = useForm({
    resolver: yupResolver(songsSchema),
    mode: "onChange",
  });
  const { handleSubmit } = methods; // Extrae métodos de react-hook-form

  const onSubmit = async (data) => {
    try {
      console.log("Datos enviados:", data);
      // Aquí podrías enviar los datos al servidor o realizar otras acciones
    } catch (error) {
      console.error("Error al enviar la canción:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-gradient-to-br from-purple-dark to-purple-darker p-8 rounded-2xl shadow-md min-h-[600px] min-w-[600px]">
        <h2 className="text-4xl font-bold text-white mb-10 ml-1">Subir Canción</h2>
        {/* FORMULARIO DE SUBIR CANCIÓN */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Input para el título de la canción */}
            <Input
              name="title"
              label="Título"
              labelClass="text-white"
              placeholder="Ingrese el título de la canción"
              containerClass="mb-6"
            />

            {/* Input para el artista */}
            <Input
              name="artist"
              label="Artista"
              labelClass="text-white"
              placeholder="Ingrese el nombre del artista"
              containerClass="mb-6"
            />

            {/* Input para el archivo de la canción */}
            <UploadInput
              name="audio"
              label="Canción"
              accept="audio/mp3"
              maxSize={10 * 1024 * 1024} // 10MB
              containerClass="mb-6"
              className="text-white"
            />

            {/* Input para el archivo de la portada */}
            <UploadInput
              name="cover"
              label="Portada"
              accept="image/png"
              maxSize={10 * 1024 * 1024} // 10MB
              containerClass="mb-6"
              className="text-white"
            />

            <div className="mx-44">
              <StartButton
                text="Subir Canción"
                type="submit"
                padding="p-4"
                margin="mb-10"
              />
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
