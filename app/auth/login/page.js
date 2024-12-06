// app/auth/login/page.js
"use client";
// Components
import LoginForm from "@/src/partials/auth/components/LoginForm";
import AuthMessage from "@/src/partials/auth/components/AuthMessage";

const LoginPage = () => {
  return (
    <div className="grid grid-cols-2 items-center justify-center min-h-screen">
      <AuthMessage action="login" />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
