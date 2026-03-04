"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { Pause, Play } from "lucide-react"

import { cn } from "@/lib/utils"

const playButton = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "rounded-full",
    "transition-all",
    "duration-150",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-accent",
  ],
  {
    variants: {
      size: {
        sm: ["size-8"],
        md: ["size-10"],
        lg: ["size-14"],
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const iconSizes = { sm: 14, md: 16, lg: 22 }

export interface PlayButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof playButton> {
  isPlaying: boolean
  onToggle: () => void
}

export function PlayButton({ isPlaying, onToggle, size = "md", className, ...props }: PlayButtonProps) {
  const iconSize = iconSizes[size ?? "md"]

  return (
    <button
      type="button"
      aria-label={isPlaying ? "Pause" : "Play"}
      onClick={onToggle}
      className={cn(playButton({ size }), "bg-white/10 text-white hover:bg-white/20 active:scale-90", className)}
      {...props}
    >
      {isPlaying ? (
        <Pause size={iconSize} fill="currentColor" />
      ) : (
        <Play size={iconSize} fill="currentColor" className="ml-0.5" />
      )}
    </button>
  )
}
