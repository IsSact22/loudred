"use client";
// Next
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Hooks
import { useForm, FormProvider } from "react-hook-form";
// Components
import Input from "@/src/components/inputs/Input";
import PasswordInput from "@/src/components/inputs/PasswordInput";
import CheckboxWithDialog from '@/src/components/checkboxes/CheckboxTerms';
import CheckboxSimple from '@/src/components/checkboxes/Checkbox';
import StartButton from "@/src/components/buttons/StartButton";
// Validations
import {yupResolver} from "@hookform/resolvers/yup"
import { registerSchema } from "@/src/validations/validationSchema";
// Toast
import toast from 'react-hot-toast';

export default function RegisterForm() {
  const router = useRouter();

  // Inicializar react-hook-form con Yup
  const methods = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onChange",
  });
  const { handleSubmit, setError } = methods; // Extrae funciones necesarias

  const onSubmit = async (data) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success('Registro exitoso');
        setTimeout(() => router.push('/auth/login'), 2000); // Redirección tras éxito
      } else {
        toast.error(result.message || 'Error en el registro');
        if (result.errors) {

          result.errors.forEach((err) => setError(err.field, { message: err.message }));
        }
      }
    } catch (error) {
      toast.error('Ocurrió un error inesperado');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="bg-gradient-to-br from-white to-purple-100 p-8 rounded-2xl mt-10 shadow-md min-h-[600px] min-w-[600px]">
      <h2 className="text-4xl font-bold text-red-500 mb-12 ml-1">Bienvenido</h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Nombre y Apellido */}
            <div className="flex gap-4 mb-4">
              {/* Nombre */}
              <Input
                name="name"
                label="Nombre"
                labelClass="text-purple-700"
                placeholder="Ingrese su nombre"
                containerClass="w-1/2"
              />
              {/* Apellido */}
              <Input
                name="lastname"
                label="Apellido"
                labelClass="text-purple-700"
                placeholder="Ingrese su apellido"
                containerClass="w-1/2"
              />
            </div>
            {/* Usuario */}
            <Input
              name="usuario"
              label="Usuario"
              labelClass="text-purple-700"
              placeholder="Ingrese su usuario"
              containerClass="mb-4"
            />
            {/* Contraseña */}
            <PasswordInput
              name="password"
              label="Contraseña"
              labelClass="text-purple-700"
              placeholder="Ingrese su contraseña"
              containerClass="mb-4"
            />
            {/* Confirmar contraseña */}
            <PasswordInput
              name="confirmPassword"
              label="Confirmar contraseña"
              labelClass="text-purple-700"
              placeholder="Confirme su contraseña"
              containerClass="mb-4"
            />
            {/* Aceptar términos y condiciones */}
            <CheckboxWithDialog
              name='termsAccepted'
              label="He leído y acepto los"
              dialogTitle="Términos y Condiciones"
              dialogContent="Aquí puedes incluir los términos y condiciones de tu aplicación."
              labelClass="text-purple-700"
              className="mb-4"
            />
            {/* Aceptar el usuario */}
            <CheckboxSimple
              name='userAccepted'
              label="Acepto que mi usuario no puede ser cambiado"
              labelClass="text-purple-700"
              className="mb-4"
            />

            {/* Botón de registro */}
            <button

              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Registrarse
            </button>
          </form>
        </FormProvider>
        <p className="mt-4 text-purple-700 font-bold text-center">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="text-red-400 font-bold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}