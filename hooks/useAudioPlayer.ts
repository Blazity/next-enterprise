"use client"

import { useEffect, useRef } from "react"

import { useMusicStore } from "@/store/musicStore"
import { PLAY_STATE } from "@/types/music"

let audioElement: HTMLAudioElement | null = null

function getAudio(): HTMLAudioElement {
  if (!audioElement) {
    audioElement = new Audio()
    audioElement.preload = "auto"
  }
  return audioElement
}

export function seekAudio(time: number) {
  const audio = getAudio()
  audio.currentTime = time
}

export function setAudioVolume(volume: number) {
  const audio = getAudio()
  audio.volume = Math.max(0, Math.min(1, volume))
}

export function useAudioPlayer() {
  const { currentlyPlaying, playState, volume, isMuted } = useMusicStore()
  const prevSongIdRef = useRef<string | null>(null)

  useEffect(() => {
    const audio = getAudio()

    if (!currentlyPlaying?.previewUrl) {
      audio.pause()
      audio.src = ""
      prevSongIdRef.current = null
      return
    }

    if (currentlyPlaying.id !== prevSongIdRef.current) {
      audio.src = currentlyPlaying.previewUrl
      audio.play().catch(() => {})
      prevSongIdRef.current = currentlyPlaying.id
      return
    }

    if (playState === PLAY_STATE.PLAYING) {
      audio.play().catch(() => {})
    } else if (playState === PLAY_STATE.PAUSED) {
      audio.pause()
    }
  }, [currentlyPlaying, playState])

  useEffect(() => {
    const audio = getAudio()
    audio.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  useEffect(() => {
    const audio = getAudio()
    const store = useMusicStore.getState

    const handleEnded = () => {
      store().setPlayingTrack(null)
    }

    const handleTimeUpdate = () => {
      store().setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      store().setDuration(audio.duration)
    }

    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)

    return () => {
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [])
}
