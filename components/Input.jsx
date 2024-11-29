import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

const Input = ({
  name, // Nombre del campo para usar en react-hook-form
  type = 'text', // Tipo de input (text, email, etc.)
  label, // Etiqueta del input
  placeholder = '', // Texto placeholder
  rules = {}, // Reglas de validación para react-hook-form
  ...props // Cualquier otra prop adicional
}) => {
  const { control, formState: { errors } } = useFormContext(); // Acceder al contexto de react-hook-form

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <input
            {...field}
            type={type}
            id={name}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors[name] ? 'border-red-500' : 'border-gray-300'
            }`}
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
