// app/auth/login/page.js
"use client";
// Components
import LoginForm from "@/src/partials/auth/components/LoginForm";

const LoginPage = ({isLogin, setIsLogin}) => {
  return (
    <div className="login-page">
      <LoginForm isLogin={isLogin}/>
    </div>
  );
};

export default LoginPage;
