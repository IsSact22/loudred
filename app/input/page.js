"use client";
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Input from '@/components/Input';

const InputForm = () => {
  const methods = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Input
                name="username"
                label="Nombre de Usuario"
                placeholder="Ingresa tu nombre de usuario"
                rules={{ required: 'Este campo es obligatorio' }}
            />
        </form>
    </FormProvider>
  );
};

export default InputForm;
