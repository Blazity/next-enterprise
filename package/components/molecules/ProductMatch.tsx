"use client"
import { Box, Typography } from "@mui/material"
import React from "react"

const ProductMatch: React.FC = () => {
  return (
    <Box sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
      <Typography variant="h6">Coincidencia de productos:</Typography> {/* TODO: Aquí irán los productos que coincidan con el PLU */}
    </Box>
  )
}

export default ProductMatch
