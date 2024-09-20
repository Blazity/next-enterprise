"use client"
import { Typography } from "@mui/material"
import React from "react"

interface TitleProps {
  text: string
  size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

const Title: React.FC<TitleProps> = ({ text, size = "h1" }) => {
  return (
    <Typography variant={size} className="font-bold">
      {text}
    </Typography>
  )
}

export default Title
