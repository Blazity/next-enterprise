"use client"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { TooltipProps as RadixTooltipProps } from "@radix-ui/react-tooltip"
import { ReactNode } from "react"

export interface TooltipProps extends RadixTooltipProps {
  content: string
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  sideOffset?: number
  children: ReactNode | ReactNode[]
}

const Tooltip = ({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  side = "top",
  align = "center",
  sideOffset = 5,
  ...props
}: TooltipProps) => {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          className="radix-state-delayed-open:radix-side-bottom:animate-slideUpAndFade radix-state-delayed-open:radix-side-left:animate-slideRightAndFade radix-state-delayed-open:radix-side-right:animate-slideLeftAndFade radix-state-delayed-open:radix-side-top:animate-slideDownAndFade select-none rounded-md bg-white px-4 py-2 shadow-md will-change-[transform,opacity]"
          side={side}
          align={align}
          sideOffset={sideOffset}
          {...props}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-white" width={11} height={5} />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

export default Tooltip
