"use client";
import { Box } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "@layouts/MainLayout";

interface CheckoutScreenProps {
  onEndTransaction: () => void; // Callback para finalizar la transacción
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ onEndTransaction }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: "background.default",
        boxShadow: '4'
      }}
    >
      <MainLayout onEndTransaction={onEndTransaction} /> 
    </Box>
  );
};

export default CheckoutScreen;
