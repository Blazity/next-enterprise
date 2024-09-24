"use client"
import { Typography } from "@mui/material"
import React from "react"

interface LabelProps {
  htmlFor: string
  text: string
}

const Label: React.FC<LabelProps> = ({ htmlFor, text }) => {
  return (
    <label htmlFor={htmlFor} className="mb-2 block">
      <Typography variant="subtitle1">
        {text}
      </Typography>
    </label>
  )
}

export default Label

