"use client"
import Grid from "@mui/material/Grid2"
import React from "react"
import NumericKey from "@molecules/NumericKey"

const NumericPad: React.FC = () => {
  const handleKeyClick = (key: number) => {
    console.log(`Key pressed: ${key}`)
  }

  return (
    <Grid container spacing={0.4} justifyContent="center" alignItems="center">
      <Grid size={{ xs: 6 }}>
        <NumericKey
          label="Cancel"
          onClick={() => console.log("Cancel pressed")}
          className="h-12 w-full bg-danger-light text-white hover:bg-danger-dark"
        />
      </Grid>
      <Grid size={{ xs: 6 }}>
        <NumericKey label="clear" onClick={() => console.log("Clear pressed")} className="size-12 bg-secondary-light" />
      </Grid>
      <Grid size={{ xs: 3 }} sx={{ minWidth: "100px" }}>
        <NumericKey
          label="0"
          onClick={() => console.log("0")}
          className="size-24 bg-primary-500 text-white hover:bg-primary-600"
        />
      </Grid>
      {[...Array(9).keys()].map((i) => (
        <Grid key={i + 1} size={{ xs: 3 }} sx={{ minWidth: "100px" }}>
          {" "}
          <NumericKey
            label={i + 1}
            onClick={() => handleKeyClick(i + 1)}
            className="size-24 bg-primary-500 text-white hover:bg-primary-600"
          />
        </Grid>
      ))}
      <Grid size={{ xs: 3 }} sx={{ minWidth: "100px" }}>
        <NumericKey
          label="."
          onClick={() => console.log(".")}
          className="size-24 bg-primary-500 text-white hover:bg-primary-600"
        />
      </Grid>
      <Grid size={{ xs: 3 }} sx={{ minWidth: "100px" }}>
        <NumericKey label="/" onClick={() => console.log("Divide pressed")} className="size-12 bg-secondary-light" />
      </Grid>
      <Grid size={{ xs: 3 }} sx={{ minWidth: "100px" }}>
        <NumericKey label="QTY" onClick={() => console.log("QTY pressed")} className="size-12 bg-secondary-light" />
      </Grid>
      <Grid size={{ xs: 3 }} sx={{ minWidth: "100px" }}>
        <NumericKey label="Price" onClick={() => console.log("Price pressed")} className="size-12 bg-secondary-light" />
      </Grid>


      <Grid size={{ xs: 6 }}>
        <NumericKey
          label="Enter"
          onClick={() => console.log("Enter pressed")}
          className="h-12 w-full bg-success-light text-white hover:bg-success-dark"
        />
      </Grid>
    </Grid>
  )
}

export default NumericPad
