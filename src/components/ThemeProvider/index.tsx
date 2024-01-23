"use client"

import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles"
import { ReactNode } from "react"

const defaultTheme = createTheme()

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return <MuiThemeProvider theme={defaultTheme}>{children}</MuiThemeProvider>
}
