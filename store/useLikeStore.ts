import { create } from "zustand"
import { getLikes, likeSong, unlikeSong } from "lib/api/likes"

interface LikeState {
  likedIds: Set<number>
  isLoading: boolean
  fetchLikes: (token: string | null) => Promise<void>
  toggleLike: (token: string | null, trackId: number) => Promise<void>
  isLiked: (trackId: number) => boolean
}

export const useLikeStore = create<LikeState>((set, get) => ({
  likedIds: new Set<number>(),
  isLoading: false,

  fetchLikes: async (token: string | null) => {
    if (!token) return
    set({ isLoading: true })
    try {
      const res = await getLikes(token)
      if (res.data) {
        set({ likedIds: new Set(res.data.map((l) => l.trackId)) })
      }
    } catch (error) {
      console.error("Failed to fetch likes", error)
    } finally {
      set({ isLoading: false })
    }
  },

  toggleLike: async (token: string | null, trackId: number) => {
    if (!token) return
    const isCurrentlyLiked = get().likedIds.has(trackId)
    
    // Optimistic update
    set((state) => {
      const newSet = new Set(state.likedIds)
      if (isCurrentlyLiked) newSet.delete(trackId)
      else newSet.add(trackId)
      return { likedIds: newSet }
    })

    try {
      if (isCurrentlyLiked) {
        await unlikeSong(token, trackId)
      } else {
        await likeSong(token, trackId)
      }
    } catch (error) {
      console.error("Failed to toggle like", error)
      // Rollback on error
      set((state) => {
        const newSet = new Set(state.likedIds)
        if (isCurrentlyLiked) newSet.add(trackId)
        else newSet.delete(trackId)
        return { likedIds: newSet }
      })
    }
  },

  isLiked: (trackId: number) => get().likedIds.has(trackId),
}))
