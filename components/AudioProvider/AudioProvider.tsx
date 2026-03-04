"use client"

import { useAudioPlayer } from "@/hooks/useAudioPlayer"

export function AudioProvider({ children }: { children: React.ReactNode }) {
  useAudioPlayer()
  return <>{children}</>
}
