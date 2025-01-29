import { useState } from 'react';
import { Checkbox as HeadlessCheckbox } from '@headlessui/react';
import { useFormContext, Controller } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/solid';

const CheckboxWithDialog = ({
  name = 'termsAccepted', // Nombre del campo para react-hook-form
  label, // Texto del checkbox
  dialogTitle, // Título del diálogo
  dialogContent, // Contenido del diálogo
  dialogButtonLabel = 'Cerrar', // Texto del botón de cierre del diálogo
  rules = {}, // Reglas de validación para react-hook-form
  className = '', // Clases adicionales para el contenedor
  labelClass = '', // Clases adicionales para el label
  dialogClass = '', // Clases adicionales para el diálogo
  ...props
}) => {
  const { control, formState: { errors } } = useFormContext(); // Acceso al contexto de react-hook-form
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className={`flex flex-col items-start gap-1 ${className}`}>
  {/* Contenedor para checkbox y label en la misma fila */}
  <div className="flex items-center gap-2">
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={false}
      render={({ field: { value, onChange } }) => (
        <>
          {/* Checkbox */}
          <HeadlessCheckbox
            checked={value}
            onChange={onChange}
            className="group block size-4 rounded border border-purple-500 bg-white data-[checked]:bg-purple-500 focus:outline-none"
            {...props}
          >
            <svg
              className="stroke-white opacity-0 group-data-[checked]:opacity-100"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M3 8L6 11L11 3.5"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </HeadlessCheckbox>
        </>
      )}
    />

    {/* Label */}
    <span className={`text-sm text-lg/6 font-bold text-purple-700 ${labelClass}`}>
      {label}{' '}
      <button
        type="button"
        onClick={() => setIsDialogOpen(true)}
        className="text-red-500 underline focus:outline-none hover:text-red-600"
      >
        términos y condiciones
      </button>
    </span>
  </div>

  {/* Mostrar error si existe */}
  {errors[name] && (
    
    <p className="text-sm text-red-500 mt-1">{errors[name].message}</p>
  )}



       {/* Dialog */}
       {isDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 "
          onClick={() => setIsDialogOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-10 relative scale-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              className="absolute top-2 right-2 text-red-500 hover:text-red-600 focus:outline-none"
              onClick={() => setIsDialogOpen(false)}
            >
              <XMarkIcon className="h-5 w-5 text-red-600 hover:text-red-800" />
            </button>

            {/* Dialog Title */}
            <h2 className="text-2xl font-bold text-center text-red-600 mb-10">
              {dialogTitle}
            </h2>

            {/* Dialog Content */}
            <div className="text-purple-900">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  <strong>Aceptación de los Términos:</strong> Al utilizar esta
                  plataforma, aceptas cumplir con los presentes Términos y
                  Condiciones.
                  <br />
                </li>
                <li>
                  <strong>Contenido permitido:</strong> Está estrictamente
                  prohibido subir canciones o contenido que:
                  <ul className="list-disc list-inside ml-5">
                    <li>
                      Incite al odio, la violencia o la discriminación por
                      razones de raza, género, religión, orientación sexual,
                      política, nacionalidad o cualquier otra característica
                      protegida.
                      <br />

                    </li>
                    <li>
                      Infrinja leyes locales, nacionales o internacionales.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Moderación de Contenidos:</strong> Nos reservamos el
                  derecho de eliminar, sin previo aviso, cualquier contenido que
                  consideremos inapropiado, que incumpla estas condiciones, o
                  que sea reportado por otros usuarios.
                </li>
                <li>
                  <strong>Responsabilidad del Usuario:</strong> Los usuarios son
                  responsables del contenido que suben y de cualquier
                  consecuencia derivada de su publicación.
                </li>
                <li>
                  <strong>Usuario único:</strong> El nombre de usuario creado en
                  el registro será la única forma en la que las demás personas
                  en la página puedan encontrarte, por lo que debe ser único y
                  no podrás modificarlo luego.
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckboxWithDialog;

