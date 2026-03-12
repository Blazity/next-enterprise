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
  const loadingNewTrackRef = useRef(false)

  useEffect(() => {
    const audio = getAudio()

    if (!currentlyPlaying?.previewUrl) {
      audio.pause()
      audio.src = ""
      prevSongIdRef.current = null
      return
    }

    // New song selected
    if (currentlyPlaying.id !== prevSongIdRef.current) {
      loadingNewTrackRef.current = true
      audio.pause()
      audio.src = currentlyPlaying.previewUrl
      audio.load()
      
      // Only auto-play if the state says we should be playing
      if (playState === PLAY_STATE.PLAYING) {
        audio.play().catch(() => {})
      }
      prevSongIdRef.current = currentlyPlaying.id
      return
    }

    // Same song, just play/pause toggled
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

  // Use requestAnimationFrame for smooth, immediate progress updates
  useEffect(() => {
    const audio = getAudio()
    const store = useMusicStore.getState
    let rafId: number | null = null

    const tick = () => {
      if (!audio.paused && !loadingNewTrackRef.current) {
        // Still fire the time to global state for the text labels (0:00 / 3:00)
        // Zustand batches these or the ref-subscription will handle it faster than React re-renders anyway.
        store().setCurrentTime(audio.currentTime)
        if (audio.duration && isFinite(audio.duration)) {
          store().setDuration(audio.duration)
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    const handleEnded = () => {
      if (store().isRepeating) {
        audio.currentTime = 0
        audio.play().catch(() => {})
        return
      }
      store().setCurrentTime(store().duration)
      store().playNext()
    }

    const handleLoadedMetadata = () => {
      store().setDuration(audio.duration)
      store().setCurrentTime(0)
      loadingNewTrackRef.current = false
    }

    const handlePlaying = () => {
      store().setBuffering(false)
    }

    const handleWaiting = () => {
      store().setBuffering(true)
    }

    rafId = requestAnimationFrame(tick)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("playing", handlePlaying)
    audio.addEventListener("waiting", handleWaiting)

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("playing", handlePlaying)
      audio.removeEventListener("waiting", handleWaiting)
    }
  }, [])
}
