"use client"

import { useEffect, useRef } from "react"

import { useUser } from "@clerk/nextjs"

import { syncUser } from "@/lib/services/playlistService"

export function UserSync() {
  const { user, isSignedIn } = useUser()
  const hasSynced = useRef(false)

  useEffect(() => {
    if (isSignedIn && user && !hasSynced.current) {
      hasSynced.current = true
      syncUser(user).catch(console.error)
    }
  }, [isSignedIn, user])

  return null
}
