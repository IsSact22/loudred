// app/auth/login/page.js
"use client";
// Components
import LoginForm from "@/src/partials/auth/components/LoginForm";
import AuthMessage from "@/src/partials/auth/components/AuthMessage";

const LoginPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center min-h-screen px-4">
      <AuthMessage action="login" className="hidden md:block" />
      <LoginForm className="w-full max-w-md mx-auto" />
    </div>
  );
};

export default LoginPage;
