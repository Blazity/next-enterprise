"use client"
import { Typography } from "@mui/material"
import React from "react"

interface LabelProps {
  htmlFor: string
  text: string
}

const Label = React.memo(({ htmlFor, text }: LabelProps) => {
  return (
    <label htmlFor={htmlFor} className="mb-2 block">
      <Typography 
        variant="subtitle1">{text}</Typography>
    </label>
  );
});

Label.displayName = "Label";

export default Label

