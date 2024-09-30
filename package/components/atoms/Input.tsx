"use client"
import { TextField } from "@mui/material"
import React from "react"

interface InputProps {
  type: string
  name?: string; 
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  autocomplete?: string
  disabled?: boolean 
}

const Input: React.FC<InputProps> = ({ 
  type,
  name,
  placeholder,
  value,
  onChange,
  onKeyDown,
  autocomplete,
  disabled
}) => {
  return (
    <TextField
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      autoComplete={autocomplete}
      fullWidth
      variant="outlined"
      disabled={disabled}
    />
  )
}

export default Input
