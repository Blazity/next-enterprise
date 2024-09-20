"use client"
import { Box, Typography } from "@mui/material"
import React from "react"

const Screen: React.FC = () => {
  return (
    <Box sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 1, textAlign: "center" }}>{/* TODO: Logica para valores */}
      <Typography variant="h6">Item Subtotal: $0.00</Typography>
      <Typography variant="body1">Total Savings: $0.00</Typography>
      <Typography variant="body1">Tax: $0.00</Typography>
    </Box>
  )
}

export default Screen
