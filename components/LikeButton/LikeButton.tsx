"use client"

import { useAuth } from "@clerk/nextjs"
import { HeartFilledIcon, HeartIcon } from "components/icons"
import { cn } from "lib/cn"
import { useRequireAuth } from "lib/hooks/useRequireAuth"
import { useLikeStore } from "store/useLikeStore"
import { useToastStore } from "store/useToastStore"

interface LikeButtonProps {
  trackId: number
  size?: number
  className?: string
}

export function LikeButton({ trackId, size = 18, className }: LikeButtonProps) {
  const { getToken } = useAuth()
  const { requireAuth } = useRequireAuth()
  const { isLiked, toggleLike } = useLikeStore()
  const { addToast } = useToastStore()
  
  const liked = isLiked(trackId)

  async function handleToggle(e: React.MouseEvent) {
    e.stopPropagation()
    requireAuth(async () => {
      const token = await getToken()
      await toggleLike(token, trackId)
      addToast(liked ? "Removed from Liked Songs" : "Added to Liked Songs")
    })
  }

  return (
    <button
      onClick={handleToggle}
      aria-label={liked ? "Unlike" : "Like"}
      className={cn(
        "bg-transparent border-0 p-1 flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-90",
        liked ? "text-red-500 scale-110" : "text-muted hover:text-primary",
        className
      )}
    >
      {liked ? (
        <HeartFilledIcon width={size} height={size} />
      ) : (
        <HeartIcon width={size} height={size} />
      )}
    </button>
  )
}
