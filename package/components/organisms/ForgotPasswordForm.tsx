"use client";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@atoms/Button";
import Input from "@atoms/Input";
import Label from "@atoms/Label";
import { ResetPassword } from "@package/config/api/Admin/auth/ResetPassword/page";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleResetPassword = async () => {
    try {
      const response = await ResetPassword({ id: email });

      if (response.correct) {
        setMessage(t("msj_Password_reset_email_sent"));
        setError(null);
      } else {
        setError(response.message || t("msj_Error_sending_password_reset"));
        setMessage(null);
      }
    } catch (err) {
      setError(t("msj_Error_sending_password_reset"));
      setMessage(null);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%" }}>
      <Typography variant="h6">{t("lbl_reset_password")}</Typography>

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

      {message && <Typography color="primary">{message}</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      <Button label={t("lbl_reset_password")} onClick={handleResetPassword} variant="primary" />
    </Box>
  );
};

export default ForgotPasswordForm;
