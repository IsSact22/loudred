// app/register/page.js
"use client"; // Directiva para habilitar el cliente en este archivo

import React from 'react';
import RegisterForm from '@/components/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="register-page">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
