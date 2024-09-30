"use client";
import { Box } from "@mui/material";
import React from "react";
import MainLayout from "@layouts/MainLayout";

const CheckoutScreen: React.FC = () => {
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
      <MainLayout />
    </Box>
  );
};

export default CheckoutScreen;