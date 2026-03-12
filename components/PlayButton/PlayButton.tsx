"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { Pause, Play } from "lucide-react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"

const playButton = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "rounded-full",
    "transition-all",
    "duration-200",
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
  const { t } = useTranslation()
  const iconSize = iconSizes[size ?? "md"]

  return (
    <button
      type="button"
      aria-label={isPlaying ? t("playButton.pause") : t("playButton.play")}
      onClick={onToggle}
      className={cn(
        playButton({ size }),
        isPlaying
          ? "bg-accent text-white shadow-lg shadow-accent/30 hover:bg-accent-hover hover:shadow-accent/40"
          : "bg-white/10 text-white hover:bg-white/20 hover:shadow-lg hover:shadow-black/20",
        "active:scale-90",
        className
      )}
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
