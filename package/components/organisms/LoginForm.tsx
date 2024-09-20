"use client"
import { Box, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { auth } from "@app/account/controller/AuthController"
import Button from "@atoms/Button"
import Input from "@atoms/Input"
import Label from "@atoms/Label"

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { t } = useTranslation()

  const handleLogin = async () => {
    const token = await auth(username, password)
    if (token) {
      router.push("/home")
    } else {
      setError( t("msj_Incorrect_credentials_try_again."))
    }
  }

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault()
        handleLogin()
      }}
      sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%" }}
    >
      <Box>
        <Label htmlFor={t("lbl_username")} text={t("lbl_username")} />
        <Input
          type="text"
          placeholder={t("msj_enter_your_username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autocomplete="username"
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
  )
}

export default LoginForm
