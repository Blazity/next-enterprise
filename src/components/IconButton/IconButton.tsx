import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import React, { forwardRef } from "react"
import { cn } from "../../utils/utils"

export const iconButtonVariants = cva(
  "h-8 w-8 inline-flex items-center justify-center rounded-md transition-transform ease-in enabled:hover:opacity-70 enabled:active:scale-90 disabled:pointer-events-none disabled:opacity-50 ring-offset-white dark:ring-offset-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "text-brand-gray dark:text-white",
        primary: "text-blue-500 dark:text-blue-400",
        success: "text-green-500 dark:text-green-400",
        warning: "text-yellow-500 dark:text-yellow-400",
        danger: "text-red-500 dark:text-red-400",
        light: "text-white",
        dark: "text-black",
      },
      backgroundVariant: {
        default: "bg-transparent hover:bg-gray-100 active:bg-gray-200",
        primary: "bg-blue-500 hover:bg-blue-600 active:bg-brand-violet-700",
        success: "bg-green-500 hover:bg-green-600 active:bg-green-700",
        warning: "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700",
        danger: "bg-red-500 hover:bg-red-600 active:bg-red-700",
        light: "bg-white hover:bg-gray-100 active:bg-gray-200",
        dark: "bg-brand-dark-500 hover:bg-brand-dark-400 active:bg-brand-dark-300",
      },
      outlined: {
        true: "border border-gray-400 enabled:hover:border-black dark:border-gray-500 dark:enabled:hover:border-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      asChild = false,
      variant = "default",
      backgroundVariant = "default",
      outlined = false,
      type = "button",
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        type={type}
        className={cn(iconButtonVariants({ variant, backgroundVariant, outlined }), className)}
        {...props}
      />
    )
  }
)
IconButton.displayName = "IconButton"

export default IconButton
