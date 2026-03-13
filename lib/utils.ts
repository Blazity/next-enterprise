import * as React from "react"

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function renderFirst(...elements: [boolean | undefined | null, React.ReactNode][]) {
  const match = elements.find(([condition]) => !!condition)
  return match ? match[1] : null
}
