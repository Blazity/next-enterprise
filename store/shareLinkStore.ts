"use client"

import { create } from "zustand"

interface ShareLinkState {
  token: string | null
  ownerName: string | null
  href: string | null
  setShareLink: (token: string, ownerName: string | null) => void
  clearShareLink: () => void
}

export const useShareLinkStore = create<ShareLinkState>((set) => ({
  token: null,
  ownerName: null,
  href: null,
  setShareLink: (token, ownerName) =>
    set({ token, ownerName: ownerName || null, href: `/s/${token}` }),
  clearShareLink: () => set({ token: null, ownerName: null, href: null }),
}))
