import { useState } from 'react';
import { Checkbox as HeadlessCheckbox } from '@headlessui/react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useFormContext, Controller } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/solid';

const CheckboxSimple = ({
  name = 'termsAccepted', // Nombre del campo para react-hook-form
  label, // Texto del checkbox
  rules = {}, // Reglas de validación para react-hook-form
  className = '', // Clases adicionales para el contenedor
  labelClass = '', // Clases adicionales para el label
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
                        {...props}>
                        <svg
                            className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                            viewBox="0 0 14 14"
                            fill="none">

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
            </span>
        </div>

        {/* Mostrar error si existe */}
        {errors[name] && (
            
            <p className="text-sm text-red-500 mt-1">{errors[name].message}</p>
        )}



    </div>
  );
};

export default CheckboxSimple;

