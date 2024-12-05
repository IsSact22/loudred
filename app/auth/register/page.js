// app/auth/register/page.js
"use client"; 
// Components
import RegisterForm from '@/src/partials/auth/components/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="register-page">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
