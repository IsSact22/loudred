import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';


//INPUT PARA CONTRASEÑAS 
const PasswordInput = ({
  name, // Nombre del campo en el formulario
  label = '', // Etiqueta del input
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
          className="block text-sm/6 font-medium text-purple-label font-bold"
        >
          {label}
        </label>
      )}

      <div className="flex items-center relativ">
        <Controller
          name={name}
          control={control}
          rules={rules}
          defaultValue=""
          render={({ field }) => (
            <input
              {...field}
              type={isVisible ? 'text' : 'password'} // Cambiar entre texto y contraseña
              id={name}
              placeholder={placeholder}
              className={`w-full px-3 py-2 border rounded-full bg-purple-input focus:outline-none focus:ring-2 focus:ring-purple-login focus:border-purple-login ${
                errors[name] ? 'border-red-500' : 'border-gray-300'
              } placeholder-purple-placeholder placeholder-opacity-40 font-black  
               ${className}`}
              {...props}
            />
          )}
        />

        {/* Botón de mostrar/ocultar contraseña */}
        <button
          type="button"
          onClick={toggleVisibility}
          className=" ml-2 flex items-center text-purple-navbar hover:text-purple-navbar focus:outline-none"
        >
            {isVisible ? (
                <EyeIcon className="h-5 w-5 text-purple-input hover:text-purple-label" />
                ) : (
                <EyeSlashIcon className="h-5 w-5 text-purple-input hover:text-purple-label" />
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

