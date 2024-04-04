import { cva, type VariantProps } from "class-variance-authority"

import { twMerge } from "tailwind-merge"

const button = cva(
  [
    "justify-center",
    "inline-flex",
    "items-center",
    "rounded-xl",
    "text-center",
    "transition-colors",
    "delay-50",
  ],
  {
    variants: {
      intent: {
        primary: ["bg-blue-400", "text-white", "hover:enabled:bg-blue-700"],
        secondary: ["bg-transparent", "text-white", "hover:bg-slate-100", "rounded-3xl", "hover:text-vizoleG2", "border-solid", "border-2", "border-slate-100"],
        hero1: ["text-black", "bg-heroBtn", "hover:bg-white", "font-medium", "rounded-3xl", "text-sm", "text-center", "me-2", "mb-2", "border-solid", "border-2", "border-slate-100"],
        aboutUs: ["bg-transparent", "w-1/4", "hover:bg-blue-500", "text-white", "font-semibold", "hover:text-white", "py-2", "px-4", "border", "border-blue-500", "hover:border-transparent", "rounded", "flex", "text-left"]
      },
      size: {
        sm: ["min-w-20", "h-full", "min-h-10", "text-sm", "py-1.5", "px-4"],
        lg: ["min-w-32", "h-full", "min-h-12", "text-lg", "py-2.5", "px-6"],
        hero1: ["min-w-15", "h-full", "min-h-5", "text-sm", "px-5", "py-2"]
      },
      underline: { true: ["underline"], false: [] },
    },
    defaultVariants: {
      intent: "primary",
      size: "lg",
    },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof button> {
  underline?: boolean
  href: string
}

export function Button({ className, intent, size, underline, ...props }: ButtonProps) {
  return (
    <a className={twMerge(button({ intent, size, className, underline }))} {...props}>
      {props.children}
    </a>
  )
}
