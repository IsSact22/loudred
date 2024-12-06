import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';


//INPUT GENERAL
const Input = ({
  name, // Nombre del campo para usar en react-hook-form
  type = 'text', // Tipo de input (text, email, etc.)
  label, // Etiqueta del input
  placeholder = '', // Texto placeholder
  rules = {}, // Reglas de validación para react-hook-form
  className = '', // Clases adicionales para estilos personalizados
  containerClass = '', // Clases para el contenedor
  ...props // Cualquier otra prop adicional
}) => {
  const { control, formState: { errors } } = useFormContext(); // Acceder al contexto de react-hook-form

  return (
    <div className={`mt-2 px-2 ${containerClass}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm/6 text-indigo-loud font-bold"
        >
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue=""
        render={({ field }) => (

          <input
            {...field}
            type={type}
            id={name}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-full bg-lavender-light focus:outline-none focus:ring-0 focus:ring-purple-dark focus:border-purple-dark ${
              errors[name] ? 'border-red-500' : 'border-gray-300'
            } placeholder-purple-darker placeholder-opacity-40
             ${className}`} // Agregar clases personalizadas
            {...props}
          />
        )}
      />
      
      {errors[name] && (
        <p className="text-sm text-red-500 mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default Input;