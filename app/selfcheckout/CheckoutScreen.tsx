"use client"
import { Box, Container } from "@mui/material"
import Grid from "@mui/material/Grid2" // Usando Grid2
import ButtonPanel from "@organisms/ButtonPanel"
import Header from "@organisms/Header"
import MainPanel from "@organisms/MainPanel"
import ProductList from "@organisms/ProductList"
import React from "react"

const CheckoutScreen: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ minHeight: "100vh", bgcolor: "background.default", padding: 0 }}>
      <Header sx={{ minHeight: "64px", marginBottom: 1 }} />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} alignItems="stretch" sx={{ height: "calc(100vh - 64px)" }}>
          <Grid size={{ xs: 12, md: 4 }} sx={{ height: "100%" }}>
            <ProductList />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} sx={{ height: "100%" }}>
            <ButtonPanel />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} sx={{ height: "100%" }}>
            <MainPanel />
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default CheckoutScreen
