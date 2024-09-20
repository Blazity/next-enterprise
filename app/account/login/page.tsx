"use client"
import LoginForm from "@organisms/LoginForm"
import React from "react"

const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700">
      <div className="w-full max-w-md rounded-lg bg-white p-10 shadow-lg">
        <h2 className="mb-8 text-center text-4xl font-bold text-blue-900">Iniciar Sesión</h2>

        <LoginForm />

        <div className="mt-4 text-center">
          <button
            onClick={() => alert("Recuperación de contraseña")} //TODO: Implement password recovery
            className="text-sm text-blue-600 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
