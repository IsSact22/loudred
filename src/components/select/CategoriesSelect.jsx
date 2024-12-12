import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useFormContext, Controller } from 'react-hook-form';
import { useState } from 'react';
  
const CategorySelect = ({
    name, // Nombre del campo para usar en react-hook-form
    label, // Etiqueta para el select
    options = [], // Lista de opciones [{ id, name }]
    containerClass = '', // Clases para el contenedor
    labelClass = '', // Clases para la etiqueta
    inputClass = '', // Clases para el input
    dropdownClass = '', // Clases para el dropdown
    rules = {}, // Reglas de validación adicionales para react-hook-form
}) => {
    const { control, formState: { errors } } = useFormContext();
    const [query, setQuery] = useState('');
  
    const filteredOptions =
      query === ''
        ? options
        : options.filter((option) => option.name.toLowerCase().includes(query.toLowerCase()));
  
    return (
      <div className={`mt-4 ${containerClass}`}>
        {label && <label htmlFor={name} className={`block text-sm font-medium ${labelClass}`}>{label}</label>}
  
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field: { onChange, value, ref } }) => (
            <Combobox
              value={value}
              onChange={(val) => onChange(val)}
              nullable
            >
              <div className="relative">
                <ComboboxInput
                  ref={ref}
                  className={clsx(
                    'w-full rounded-md border py-2 px-3 text-sm',
                    inputClass,
                    errors[name] ? 'border-red-500' : 'border-gray-300'
                  )}
                  displayValue={(option) => option?.name || ''}
                  onChange={(event) => setQuery(event.target.value)}
                  id={name}
                />
                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                </ComboboxButton>
              </div>
  
              <ComboboxOptions
                className={clsx(
                  'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5',
                  dropdownClass
                )}
              >
                {filteredOptions.map((option) => (
                  <ComboboxOption
                    key={option.id}
                    value={option}
                    className={({ active }) =>
                      clsx(
                        'cursor-pointer select-none py-2 px-4',
                        active ? 'bg-blue-500 text-white' : 'text-gray-900'
                      )
                    }
                  >
                    {option.name}
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </Combobox>
          )}
        />
  
        {errors[name] && (
          <p className="mt-1 text-sm text-red-500">{errors[name]?.message}</p>
        )}
      </div>
    );
  };
  
  export default CategorySelect;
  