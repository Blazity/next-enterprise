"use client"
import Title from "@atoms/Title"
import { Tooltip } from "@atoms/Tooltip"
import { Box, Button, Container } from "@mui/material"
import React from "react"

const PreCheckoutScreen: React.FC = () => {
  const handleStartCheckout = () => {
    console.log("Comenzar checkout")
  }

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", marginTop: "20vh" }}>
      <Box sx={{ backgroundColor: "#f1f1f1", padding: "40px", borderRadius: "8px", boxShadow: 3 }}>
        <Title text="Esta caja está" size="h4" />
        <Title text="Abierta" size="h2" />

        <Tooltip explainer="Escanee un producto o pulse el botón para comenzar" withArrow side="top">
          <Title text="Escanee un producto o pulse aquí para comenzar" size="h6" />
        </Tooltip>

        <Button
          variant="contained"
          color="success"
          size="large"
          sx={{ marginTop: "40px" }}
          onClick={handleStartCheckout}
        >
          Comenzar
        </Button>
      </Box>
    </Container>
  )
}

export default PreCheckoutScreen
