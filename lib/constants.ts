// App-level constants — non-iTunes, non-i18n

export const ACTIVE_VIEWS = ["home", "search", "songs", "albums", "artists"] as const
export type ActiveView = (typeof ACTIVE_VIEWS)[number]

// Clerk appearance — only override accent color, let Clerk handle the rest
export const CLERK_APPEARANCE = {
  variables: {
    colorPrimary: "#4ADE80",
  },
} as const
