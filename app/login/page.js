// app/login/page.js
"use client"; // Directiva para habilitar el cliente en este archivo

import React from 'react';
import LoginForm from '../../components/loginForm';

const LoginPage = () => {
  return (
    <div className="login-page">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
