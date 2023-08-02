"use client"
import { NextUIProvider } from "@nextui-org/react"

export default function NextUiProvider({ children }) {
  return <NextUIProvider>{children}</NextUIProvider>
}
