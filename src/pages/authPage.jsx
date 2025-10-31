import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import EmailVerificationForm from "../components/auth/EmailVerificationForm";
// import AuthForm from "../components/auth/AuthForm";

const AuthPage = () => {
  const [authMode, setAuthMode] = useState("login");

  return (
    <MainLayout>
      <div className="flex justify-start mt-[3%] gap-40">
        <div className="w-[40%] h-[500px] bg-amber-900 ml-40">이미지</div>

        <div className="flex flex-col items-center justify-center w-full max-w-md">
          {authMode === "login" && <LoginForm onSwitch={setAuthMode} />}
          {authMode === "signup" && <SignupForm onSwitch={setAuthMode} />}
          {(authMode === "emailVerification" ||
            authMode === "changePassword") && (
            <EmailVerificationForm onSwitch={setAuthMode} mode={authMode} />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AuthPage;
