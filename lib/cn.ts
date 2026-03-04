import { twMerge } from "tailwind-merge"

export function cn(...classes: (string | undefined | false | null)[]) {
  return twMerge(classes.filter(Boolean).join(" "))
}
