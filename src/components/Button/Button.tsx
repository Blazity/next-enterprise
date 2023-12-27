"use client"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import React, { forwardRef } from "react"
import { animated, useSpring } from "@react-spring/web"
import { cn } from "../../utils/utils"
import { useMeasure } from "../../hooks"
import Loader from "../Loader"

export const buttonVariants = cva(
  "box-border inline-flex cursor-pointer items-center justify-center rounded-md border border-transparent align-middle leading-4 transition-transform ease-in enabled:active:scale-95 disabled:pointer-events-none disabled:opacity-50 ring-offset-white dark:ring-offset-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-gray-400 bg-white enabled:hover:border-black dark:border-gray-500 dark:bg-brand-dark-500 dark:text-white dark:enabled:hover:border-gray-300",
        primary: "bg-blue-500 text-white hover:bg-blue-600 active:border-blue-700",
        success: "bg-green-500 text-white hover:bg-green-600 active:border-green-700",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600 active:border-yellow-700",
        danger: "bg-red-500 text-white hover:bg-red-600 active:border-red-700",
        link: "bg-transparent enabled:hover:underline text-blue-500 hover:text-blue-600",
        light: "border-gray-400 bg-white enabled:hover:border-black",
        dark: "border-gray-500 bg-brand-dark-200 text-white enabled:hover:border-white",
        ghost:
          "bg-transparent text-black hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-brand-dark-500 dark:active:bg-brand-dark-600 dark:text-white",
      },
      size: {
        default: "px-5 py-2.5 h-10",
        sm: "h-9 px-4",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

/**
 * `Button` allows us to create a consistent style for all of our user actions.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild = false,
      variant = "default",
      size = "default",
      loading = false,
      type = "button",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const [bindLoader, { width: loaderWidth }] = useMeasure<HTMLDivElement>()
    const loaderAnimationProps = useSpring({
      width: loading ? loaderWidth * 2 : 0,
      marginLeft: loading ? 8 : 0,
    })

    const loaderVariant = () => {
      switch (variant) {
        case "default":
          return "default"
        case "ghost":
          return "default"
        case "link":
          return "primary"
        case "light":
          return "black"
        case "dark":
          return "white"
        default:
          return "white"
      }
    }

    return (
      <Comp ref={ref} type={type} className={cn(buttonVariants({ variant, size }), className)} {...props}>
        <div className="flex flex-row flex-nowrap content-center items-center">
          {children}
          {loading && (
            <animated.div style={loaderAnimationProps}>
              <Loader
                size="sm"
                className="text-[1.5px]"
                variant={loaderVariant()}
                ringColor="transparent"
                {...bindLoader}
              />
            </animated.div>
          )}
        </div>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export default Button
