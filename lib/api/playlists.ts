// lib/api/playlists.ts

export interface PlaylistTrack {
  id: string
  playlistId: string
  trackId: number
  position: number
  addedAt: string
}

export interface Playlist {
  id: string
  name: string
  description: string | null
  userId: string
  createdAt: string
  updatedAt: string
  tracks?: PlaylistTrack[]
  /** From list endpoint when tracks are not included */
  _count?: { tracks: number }
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function fetchApi<T>(
  endpoint: string,
  token: string | null,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      let errorMsg = "An error occurred"
      try {
        const errorData = await response.json() as Record<string, unknown>
        errorMsg = (errorData.error as string) || (errorData.message as string) || errorMsg
      } catch {
        errorMsg = response.statusText
      }
      return { error: errorMsg }
    }

    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return { data: { success: true } as unknown as T }
    }

    let json: unknown
    try {
      json = await response.json()
    } catch {
      return { data: {} as T }
    }

    const data = (json as Record<string, unknown>).data !== undefined
      ? (json as Record<string, unknown>).data
      : json

    return { data: data as T }
  } catch (error: unknown) {
    console.error(`[fetchApi] Error calling ${endpoint}:`, error)
    return { error: error instanceof Error ? error.message : "Network error" }
  }
}

export async function getPlaylists(token: string | null) {
  return fetchApi<Playlist[]>("/api/playlists", token)
}

export async function createPlaylist(token: string | null, name: string, description?: string) {
  return fetchApi<Playlist>("/api/playlists", token, {
    method: "POST",
    body: JSON.stringify({ name, description }),
  })
}

export async function getPlaylist(token: string | null, id: string) {
  return fetchApi<Playlist>(`/api/playlists/${id}`, token)
}

export async function updatePlaylist(token: string | null, id: string, data: { name?: string; description?: string }) {
  return fetchApi<Playlist>(`/api/playlists/${id}`, token, {
    method: "PATCH", // or PUT depending on backend, standard is PATCH for partial
    body: JSON.stringify(data),
  })
}

export async function deletePlaylist(token: string | null, id: string) {
  return fetchApi<{ success: boolean }>(`/api/playlists/${id}`, token, {
    method: "DELETE",
  })
}

export async function addTrack(token: string | null, playlistId: string, trackId: number, position?: number) {
  return fetchApi<PlaylistTrack>(`/api/playlists/${playlistId}/tracks`, token, {
    method: "POST",
    body: JSON.stringify({ trackId, position }),
  })
}

export async function removeTrack(token: string | null, playlistId: string, trackId: number) {
  return fetchApi<{ success: boolean }>(`/api/playlists/${playlistId}/tracks/${trackId}`, token, {
    method: "DELETE",
  })
}

export async function reorderTracks(token: string | null, playlistId: string, tracks: { trackId: number; position: number }[]) {
  return fetchApi<{ success: boolean }>(`/api/playlists/${playlistId}/tracks/reorder`, token, {
    method: "PUT",
    body: JSON.stringify({ tracks }),
  })
}
