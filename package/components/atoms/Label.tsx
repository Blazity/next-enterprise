"use client"
import { Typography } from "@mui/material"
import React from "react"

interface LabelProps {
  htmlFor: string
  text: string
}

const Label: React.FC<LabelProps> = ({ htmlFor, text }) => {
  return (
    <Typography variant="subtitle1" component="label" htmlFor={htmlFor} className="mb-2 block">
      {text}
    </Typography>
  )
}

export default Label
