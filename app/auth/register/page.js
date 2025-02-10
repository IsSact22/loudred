// app/auth/register/page.js
"use client"; 
// Components
import RegisterForm from "@/src/partials/auth/components/RegisterForm";
import AuthMessage from "@/src/partials/auth/components/AuthMessage";

const RegisterPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center min-h-screen px-4">
      <AuthMessage action="register" className="hidden md:block" />
      <RegisterForm className="w-full max-w-md mx-auto" />
    </div>
  );
};

export default RegisterPage;
