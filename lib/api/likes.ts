import { fetchApi } from "./fetchApi"

export interface LikedSong {
  id: string
  userId: string
  trackId: number
  likedAt: string
}

export async function getLikes(token: string | null) {
  return fetchApi<LikedSong[]>("/api/likes", token)
}

export async function likeSong(token: string | null, trackId: number) {
  return fetchApi<LikedSong>("/api/likes", token, {
    method: "POST",
    body: JSON.stringify({ trackId }),
  })
}

export async function unlikeSong(token: string | null, trackId: number) {
  return fetchApi<{ success: boolean }>(`/api/likes/${trackId}`, token, {
    method: "DELETE",
  })
}
