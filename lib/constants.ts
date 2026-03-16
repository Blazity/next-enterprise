// App-level constants — non-iTunes, non-i18n

export const ACTIVE_VIEWS = ["home", "search", "songs", "albums", "artists", "playlists", "liked-songs", "album_detail", "artist_detail", "podcasts", "genres", "podcast_detail", "genre_detail", "suggested"] as const
export type ActiveView = (typeof ACTIVE_VIEWS)[number]

// Typing placeholder animation speeds (ms)
export const TYPING_SPEED = 80
export const DELETING_SPEED = 40
export const PAUSE_AFTER_TYPING = 2000
export const PAUSE_AFTER_DELETING = 400

// Debounce delay for search-as-you-type (ms)
export const SEARCH_DEBOUNCE_MS = 400

// Clerk appearance — only override accent color, let Clerk handle the rest
export const CLERK_APPEARANCE = {
  variables: {
    colorPrimary: "#f5f5f0",
    colorTextOnPrimaryBackground: "#111111",
  },
} as const
