// app/auth/register/page.js
"use client"; 
// Components
import RegisterForm from '@/src/partials/auth/components/RegisterForm';
import AuthMessage from "@/src/partials/auth/components/AuthMessage";


const RegisterPage = () => {
  return (
    <div className="grid grid-cols-2 items-center justify-center min-h-screen">
      <AuthMessage action="register" />
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
