"use client";
// Components
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
// Hooks
import { useFormContext, Controller } from "react-hook-form";
import { useData } from "@/src/hooks/useData";
import clsx from "clsx";
// Icons
import { ChevronDownIcon } from "@heroicons/react/20/solid";
// React
import { useState } from "react";

const CategorySelect = ({
  name, // Nombre del campo para usar en react-hook-form
  label, // Etiqueta
  placeholder = "Selecciona una categoría", // Placeholder por defecto
  labelClass = "", // Clases adicionales para la etiqueta
  containerClass = "", // Clases para el contenedor
  className = "", // Clases adicionales personalizadas
  rules = {}, // Reglas de validación
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext(); // Obtener control y errores del formulario
  const {
    data: categories = [],
  } = useData("/songs/categories");
  const [query, setQuery] = useState(""); // Estado del query del input

  // Filtrado de categorías basado en el query
  const filteredCategories =
    query === ""
      ? categories
      : categories.filter((category) =>
          category.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className={`mt-2 px-2 ${containerClass}`}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-lg font-bold ${labelClass}`}
        >
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={null}
        render={({ field: { onChange, value } }) => (
          <Combobox value={value} onChange={onChange} nullable>
            <div className="relative mt-2">
              <ComboboxInput
                id={name}
                placeholder={placeholder}
                onChange={(e) => setQuery(e.target.value)}
                displayValue={(category) => category?.name || ""}
                className={clsx(
                  `w-full mt-2 px-3 py-3 border rounded-2xl bg-purple-100 text-purple-800 
                   focus:outline-none focus:ring-0 focus:border-purple-500 
                   placeholder-purple-700 placeholder-opacity-40`,
                  errors[name] ? "border-red-500" : "border-purple-300",
                  className
                )}
              />
              <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDownIcon className="mt-1 h-5 w-5 text-purple-500" />
              </ComboboxButton>

              {/* Opciones */}
              <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-white rounded-lg shadow-lg">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <ComboboxOption
                      key={category.id}
                      value={category}
                      className={({ active }) =>
                        clsx(
                          "cursor-pointer select-none py-2 px-4 rounded-md",
                          active ? "bg-purple-500 text-white" : "text-gray-900"
                        )
                      }
                    >
                      {category.name}
                    </ComboboxOption>
                  ))
                ) : (
                  <p className="p-2 text-gray-500 text-sm">
                    No se encontraron categorías
                  </p>
                )}
              </ComboboxOptions>
            </div>
          </Combobox>
        )}
      />

      {errors[name] && (
        <p className="text-sm text-red-500 mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default CategorySelect;
