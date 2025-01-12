"use client";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useFormContext, Controller } from "react-hook-form";
import { useData } from "@/src/hooks/useData";
import clsx from "clsx";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

const UsersSelect = ({
  name,
  label,
  placeholder = "Selecciona un usuario",
  notFound = "No se encontraron usuarios",
  labelClass = "",
  containerClass = "",
  className = "",
  rules = {},
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { data: users = [] } = useData("/admin/users");
  const [query, setQuery] = useState("");

  const filteredUsers =
    query === ""
      ? users
      : users.filter((user) =>
          user.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className={`mt-2 px-2 ${containerClass}`}>
      {label && (
        <label htmlFor={name} className={`block text-lg font-bold ${labelClass}`}>
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
                displayValue={(user) => user?.name || ""}
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

              <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-white rounded-lg shadow-lg">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <ComboboxOption
                      key={user.id}
                      value={user}
                      className={({ active }) =>
                        clsx(
                          "cursor-pointer select-none py-2 px-4 rounded-md",
                          active ? "bg-purple-500 text-white" : "text-gray-900"
                        )
                      }
                    >
                      {user.name}
                    </ComboboxOption>
                  ))
                ) : (
                  <p className="p-2 text-gray-500 text-sm">{notFound}</p>
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

export default UsersSelect;