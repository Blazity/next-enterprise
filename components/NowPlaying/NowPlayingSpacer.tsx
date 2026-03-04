"use client"

import { useMusicStore } from "@/store/musicStore"

export function NowPlayingSpacer() {
  const currentlyPlaying = useMusicStore((s) => s.currentlyPlaying)
  if (!currentlyPlaying) return null
  return <div className="h-[53px] shrink-0" />
}
