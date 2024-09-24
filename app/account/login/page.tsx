"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ForgotPasswordForm from "@organisms/ForgotPasswordForm";
import LoginForm from "@organisms/LoginForm";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [showForgotPassword, setShowForgotPassword] = useState(false); // Nuevo estado para alternar entre Login y Recuperación de contraseña

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700">
      <div className="w-full max-w-md rounded-lg bg-white p-10 shadow-lg">
        {showForgotPassword ? (
          <>
            <h2 className="mb-8 text-center text-4xl font-bold text-blue-900">{t("lbl_reset_password")}</h2>
            <ForgotPasswordForm />
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowForgotPassword(false)} // Permitir volver al formulario de Login
                className="text-sm text-blue-600 hover:underline"
              >
                {t("msj_back_to_login")}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-8 text-center text-4xl font-bold text-blue-900">{t("lbl_login")}</h2>
            <LoginForm />
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowForgotPassword(true)} // Mostrar el formulario de recuperación de contraseña
                className="text-sm text-blue-600 hover:underline"
              >
                {t("msj_forgot_password")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
