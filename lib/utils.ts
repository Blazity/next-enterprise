import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function renderFirst<T>(...cases: [boolean, T][]): T | null {
  for (const [condition, element] of cases) {
    if (condition) return element
  }
  return null
}
