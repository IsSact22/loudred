import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';


//INPUT PARA CONTRASEÑAS 
const PasswordInput = ({
  name, // Nombre del campo en el formulario
  label = '', // Etiqueta del input
  labelClass = '', // Clases adicionales para la etiqueta
  placeholder = '', // Placeholder
  className = '', // Clases adicionales para estilos personalizados
  containerClass = '', // Clases para el contenedor
  rules = {}, // Reglas de validación específicas para contraseñas
  ...props // Props adicionales
}) => {
  const [isVisible, setIsVisible] = useState(false); // Control de visibilidad de contraseña
  const { control, formState: { errors } } = useFormContext();

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className={`mt-2 px-2 ${containerClass}`}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-lg/6 font-bold ${labelClass}`}
        >
          {label}
        </label>
      )}

      <div className="flex items-center relative">
        <Controller
          name={name}
          control={control}
          rules={rules}
          defaultValue=""
          render={({ field }) => (
            <input
              {...field}
              type={isVisible ? "text" : "password"} // Cambiar entre texto y contraseña
              id={name}
              placeholder={placeholder}
              className={`w-full mt-2 px-3 py-3 border rounded-2xl bg-lavender-light focus:outline-none focus:ring-0 focus:ring-purple-dark focus:border-purple-dark ${
                errors[name] ? "border-red-500" : "border-gray-300"
              } placeholder-purple-darker placeholder-opacity-40  
               ${className}`}
              {...props}
            />
          )}
        />

        {/* Botón de mostrar/ocultar contraseña */}
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-4 flex items-center mt-2 text-lavender hover:text-lavender focus:outline-none"
        >
          {isVisible ? (
            <EyeIcon className="h-5 w-5 text-lavender hover:text-indigo-loud" />
          ) : (
            <EyeSlashIcon className="h-5 w-5 text-lavender hover:text-indigo-loud" />
          )}
        </button>
      </div>

      {errors[name] && (
        <p className="text-sm text-red-500 mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default PasswordInput;

