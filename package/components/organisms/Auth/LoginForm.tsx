"use client";
import { Box, Typography } from "@mui/material";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@atoms/Button";
import Input from "@atoms/Input";
import Label from "@atoms/Label";
import UserAtom from "@atoms/states/UserAtom";
import { LoginResponse } from "@interfaces/ResponseInterfaces/Auth/UserResponseInterface";
import { Login } from "@package/config/api/Admin/auth/Login/page";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useTranslation();
  const setUser = useSetAtom(UserAtom); // Hook para actualizar el estado global del usuario

  const handleLogin = async () => {
    try {
      const response: LoginResponse = await Login(email, password);
      if (response.correct) {
        // Almacenamos los datos del usuario logueado en el átomo global
        setUser(response.object);

        // Redireccionamos a la página deseada
        router.push("/selfcheckout/precheckout");
      } else {
        setError(response.message || t("msj_Incorrect_credentials_try_again"));
      }
    } catch (err) {
      setError(t("msj_Incorrect_credentials_try_again"));
    }
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
      sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%" }}
    >
      <Box>
        <Label htmlFor={t("lbl_email")} text={t("lbl_email")} />
        <Input
          type="email"
          placeholder={t("msj_enter_your_email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autocomplete="email"
        />
      </Box>

      <Box>
        <Label htmlFor={t("lbl_password")} text={t("lbl_password")} />
        <Input
          type="password"
          placeholder={t("msj_enter_your_password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autocomplete="current-password"
        />
      </Box>

      {error && <Typography color="error">{error}</Typography>}

      <Button label={t("lbl_login")} onClick={handleLogin} variant="primary" />
    </Box>
  );
};

export default LoginForm;
