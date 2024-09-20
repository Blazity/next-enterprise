"use client"
import { Card, CardContent } from "@mui/material"
import Grid from "@mui/material/Grid2"
import React from "react"
import NumericPad from "@molecules/NumericPad"
import PluEntry from "@molecules/PluEntry"
import ProductMatch from "@molecules/ProductMatch"
import Screen from "@molecules/Screen"

const MainPanel: React.FC = () => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ padding: "8px" }}>
        <Grid container spacing={1} justifyContent="center" alignItems="stretch">
          <Grid size={{ xs: 12 }}>
            <Screen />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <ProductMatch />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <PluEntry />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <NumericPad />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default MainPanel
