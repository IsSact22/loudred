import { useFormContext, Controller } from 'react-hook-form';

const Checkbox = ({
    name, // Nombre del campo para usar en react-hook-form
    label, // Etiqueta del checkbox
    labelClass = '', // Clases adicionales para la etiqueta
    containerClass = '', // Clases adicionales para el contenedor
    rules = {}, // Reglas de validación para react-hook-form
    className = '', // Clases adicionales para estilos personalizados
  }) => {
    const { control, formState: { errors } } = useFormContext(); // Acceder al contexto de react-hook-form
  
    return (
        <div className={`mt-2 px-2 ${containerClass}`}>
          <Controller
            name={name}
            control={control}
            rules={rules}
            defaultValue={false}
            render={({ field }) => (
              <div className="flex items-start gap-2">
                <input
                  {...field}
                  type="checkbox"
                  id={name}
                  className={`rounded border-gray-300 text-purple-dark focus:ring-purple-dark ${className}`}
                />
                <label
                  htmlFor={name}
                  className={`text-sm text-gray-700 ${labelClass}`}
                >
                  {label}{' '}
                  <span
                    onClick={toggleModal}
                    className="text-purple-600 underline cursor-pointer"
                  >
                    Términos y Condiciones
                  </span>
                </label>
              </div>
            )}
          />
          {errors[name] && (
            <p className="text-sm text-red-500 mt-1">{errors[name].message}</p>
          )}
    
          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg">
                <h2 className="text-xl font-bold mb-4">Términos y Condiciones</h2>
                <p className="text-gray-700">{modalContent}</p>
                <button
                  onClick={toggleModal}
                  className="mt-4 bg-purple-dark text-white px-4 py-2 rounded hover:bg-purple-darker"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      );
    };
    
    export default Checkbox;