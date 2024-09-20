"use client"
import { TextField } from "@mui/material"
import React from "react"

interface InputProps {
  type: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  autocomplete?: string
}

const Input: React.FC<InputProps> = ({ type, placeholder, value, onChange, autocomplete }) => {
  return (
    <TextField
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autocomplete}
      fullWidth
      variant="outlined"
    />
  )
}

export default Input
