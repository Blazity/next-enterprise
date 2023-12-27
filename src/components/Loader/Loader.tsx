import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import React, { forwardRef } from "react"
import { cn } from "../../utils/utils"

export const loaderVariants = cva(
  "relative mx-auto h-[10em] w-[10em] animate-spin rounded-[50%] border-b-[1.1em] border-l-[1.1em] border-r-[1.1em] border-t-[1.1em] indent-[-9999em] text-[0.75rem] after:h-[10em] after:w-[10em] after:rounded-[50%]",
  {
    variants: {
      variant: {
        default: "border-l-black dark:border-l-white",
        black: "border-l-black",
        white: "border-l-white",
        primary: "border-l-brand-violet-500",
        success: "border-l-green-500",
        warning: "border-l-yellow-500",
        danger: "border-l-red-500",
      },
      size: {
        sm: "text-[2px]",
        md: "text-base",
        lg: "text-lg",
      },
      ringColor: {
        default:
          "border-r-gray-300 border-t-gray-300 border-b-gray-300 dark:border-r-brand-dark-300 dark:border-t-brand-dark-300 dark:border-b-brand-dark-300",
        black: "border-r-black border-t-black border-b-black",
        white: "border-r-white border-t-white border-b-white",
        primary: "border-r-brand-violet-500 border-t-brand-violet-500 border-b-brand-violet-500",
        success: "border-r-green-500 border-t-green-500 border-b-green-500",
        warning: "border-r-yellow-500 border-t-yellow-500 border-b-yellow-500",
        danger: "border-r-red-500 border-t-red-500 border-b-red-500",
        transparent: "border-r-transparent border-t-transparent border-b-transparent",
      },
      inline: {
        true: "inline-block",
      },
    },
  }
)

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof loaderVariants> {
  asChild?: boolean
  loading?: boolean
}

/**
 * A simple spinner for showing that work is being done.
 */
const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  (
    { asChild = false, size = "md", variant = "primary", ringColor = "default", inline = false, className, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "div"

    return <Comp ref={ref} className={cn(loaderVariants({ size, variant, ringColor, inline }), className)} {...props} />
  }
)
Loader.displayName = "Loader"

export default Loader
