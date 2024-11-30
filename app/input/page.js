//LLAMADO AL INPUT GENERAL
// "use client";
// import React from 'react';
// import { useForm, FormProvider } from 'react-hook-form';
// import Input from '@/components/Input';

// const InputForm = () => {
//   // Establecemos valores predeterminados para los inputs
//   const methods = useForm({
//     defaultValues: {
//       username: '', // Valor inicial para evitar undefined
//     },
//   });

//   const onSubmit = (data) => {
//     console.log(data);
//   };

//   return (
//     <FormProvider {...methods}>
//       <form onSubmit={methods.handleSubmit(onSubmit)}>
//         <Input
//           name="username"
//           label="Nombre"
//           placeholder="Fulanito"
//           rules={
//             { required: 'Este campo es obligatorio' }
//           }
//           className="w-96"
//         />
//       </form>
//     </FormProvider>
//   );
// };

// export default InputForm;



//LLAMADO AL INPUT DE CONTRASEÑA
"use client";
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import PasswordInput from '@/components/PasswordInput';

const PasswordForm = () => {
  const methods = useForm({
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <PasswordInput
          name="password"
          label="Contraseña"
          placeholder="Pablito0811"
          rules={{
            required: 'La contraseña es obligatoria',
            minLength: {
              value: 8,
              message: 'La contraseña debe tener al menos 8 caracteres',
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: 'Debe incluir mayúsculas, minúsculas, números y un carácter especial',
            },
          }}
        />
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Enviar
        </button>
      </form>
    </FormProvider>
  );
};

export default PasswordForm;
