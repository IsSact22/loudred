import { useFormContext, Controller } from 'react-hook-form';

const Input = ({
  name, // Nombre del campo para usar en react-hook-form
  type = 'text', // Tipo de input (text, email, etc.)
  label, // Etiqueta del input
  labelClass = '', // Clases adicionales para la etiqueta
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
          className={`block text-lg/6 font-bold ${labelClass}`}
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
            className={`w-full mt-2 px-3 py-3 mb-5 border rounded-2xl bg-lavender-light focus:outline-none focus:ring-0 focus:ring-purple-dark focus:border-purple-dark ${
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