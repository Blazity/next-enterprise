"use client"
import { Button as MUIButton } from "@mui/material"
import React from "react"

interface ButtonProps {
  label: string
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info"
  onClick?: () => void
  disabled?: boolean
  className?: string
  startIcon?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  onClick,
  disabled,
  className = "",
  startIcon,
}) => {
  const colorMap: Record<string, "primary" | "secondary" | "error" | "warning" | "info" | "success"> = {
    primary: "primary",
    secondary: "secondary",
    success: "success",
    danger: "error",
    warning: "warning",
    info: "info",
  }

  return (
    <MUIButton
      onClick={onClick}
      disabled={disabled}
      color={colorMap[variant ?? "primary"]}
      className={className}
      variant="contained"
      startIcon={startIcon}
    >
      {label}
    </MUIButton>
  )
}

export default Button
