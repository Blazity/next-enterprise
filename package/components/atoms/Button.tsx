"use client";
import { Button as MUIButton } from "@mui/material";
import React, { forwardRef } from "react";

interface ButtonProps {
  label: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  startIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      type = "button",
      variant = "primary",
      onClick,
      disabled,
      className = "",
      startIcon,
    },
    ref
  ) => {
    const colorMap: Record<string, "primary" | "secondary" | "error" | "warning" | "info" | "success"> = {
      primary: "primary",
      secondary: "secondary",
      success: "success",
      danger: "error",
      warning: "warning",
      info: "info",
    };

    return (
      <MUIButton
        ref={ref}
        type={type} 
        onClick={onClick}
        disabled={disabled}
        color={colorMap[variant ?? "primary"]}
        className={className}
        variant="contained"
        startIcon={startIcon}
      >
        {label}
      </MUIButton>
    );
  }
);

Button.displayName = "Button";

export default Button;
