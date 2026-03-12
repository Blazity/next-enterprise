// BentoGrid — Magic UI approved component (wednesday-design)
// Asymmetric grid layout with animated cards for the home page

import { type ReactNode } from "react"

import { cn } from "lib/cn"

interface BentoGridProps {
  children: ReactNode
  className?: string
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]",
        className
      )}
    >
      {children}
    </div>
  )
}

interface BentoCardProps {
  children: ReactNode
  className?: string
  colSpan?: 1 | 2 | 3
  rowSpan?: 1 | 2
}

const COL_SPAN_MAP = {
  1: "",
  2: "md:col-span-2",
  3: "md:col-span-3",
} as const

const ROW_SPAN_MAP = {
  1: "",
  2: "md:row-span-2",
} as const

export function BentoCard({ children, className, colSpan = 1, rowSpan = 1 }: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl md:rounded-[2rem] border border-border bg-surface p-5 md:p-7 xl:p-8",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover",
        COL_SPAN_MAP[colSpan],
        ROW_SPAN_MAP[rowSpan],
        className
      )}
    >
      {children}
    </div>
  )
}
