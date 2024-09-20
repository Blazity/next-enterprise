"use client"
import Grid2 from "@mui/material/Grid2"
import React from "react"
import Button from "@atoms/Button"

interface NumericKeyProps {
  label: string | number
  onClick: () => void
  className?: string
}

const NumericKey: React.FC<NumericKeyProps> = ({ label, onClick, className }) => {
  return (
    <Grid2 container justifyContent="center" component="div">
      <Button label={label.toString()} onClick={onClick} className={`h-16 w-full ${className}`} />
    </Grid2>
  )
}

export default NumericKey
