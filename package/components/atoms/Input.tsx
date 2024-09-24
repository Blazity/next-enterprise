"use client"
import { TextField } from "@mui/material"
import React from "react"

interface InputProps {
  type: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  autocomplete?: string
  disabled?: boolean 
}

const Input: React.FC<InputProps> = ({ type, placeholder, value, onChange, autocomplete, disabled  }) => {
  return (
    <TextField
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autocomplete}
      fullWidth
      variant="outlined"
      disabled={disabled}
    />
  )
}

export default Input
