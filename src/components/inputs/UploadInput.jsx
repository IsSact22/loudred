import { useFormContext, Controller } from 'react-hook-form';
import { useCallback } from 'react';

const UploadInput = ({
  name,
  label,
  accept = '',
  maxSize = 10 * 1024 * 1024,
  containerClass = '',
  labelClass = '',
  className = '',
  rules = {},
}) => {
  const { control, formState: { errors } } = useFormContext();

  const validateFileSize = useCallback(
    (file) => (file && file.size <= maxSize) || `El archivo debe ser menor a ${maxSize / 1024 / 1024} MB`,
    [maxSize]
  );

  return (
    <div className={`mt-2 px-2 ${containerClass}`}>
      {label && (
        <label htmlFor={name} className={`block text-lg/6 font-bold ${labelClass}`}>
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={{
          ...rules,
          validate: {
            fileSize: (fileList) => validateFileSize(fileList?.[0]),
          },
        }}
        render={({ field: { onChange, value, ...field } }) => (
          <div
            className={`relative border-dashed border-2 rounded-lg p-4 text-center cursor-pointer ${className} ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
            onClick={() => document.getElementById(name).click()}
          >
            <input
              type="file"
              accept={accept}
              id={name}
              onChange={(e) => onChange(e.target.files)}
              className="hidden"
              {...field}
            />
            <label htmlFor={name} className="text-purple-darker hover:underline">
              {value?.[0]?.name || 'Selecciona un archivo'}
            </label>
            <p className="text-sm text-gray-500 mt-2">
              Debe ser en formato {accept.replace(/,/g, ', ')} y menor a {maxSize / 1024 / 1024} MB.
            </p>
          </div>
        )}
      />

      {errors[name] && <p className="text-sm text-red-500 mt-1">{errors[name].message}</p>}
    </div>
  );
};

export default UploadInput;
