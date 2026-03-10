// App-level constants — non-iTunes, non-i18n

export const ACTIVE_VIEWS = ["home", "search", "songs", "albums", "artists", "playlists"] as const
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
    colorPrimary: "#4ADE80",
  },
} as const
