"use client"
import { Card, CardContent, Typography } from "@mui/material"
import React from "react"

const ProductList: React.FC = () => {
  return (
    <Card sx={{ height: "100%" }}>
      {" "}
      {/* Ajustar la altura de la Card */}
      <CardContent>
        <Typography variant="h6" color="text.primary">
          Lista de productos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Producto 1
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Producto 2
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Producto 3
        </Typography>
      </CardContent>
    </Card>
  )
}

export default ProductList
