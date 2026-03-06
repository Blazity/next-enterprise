// UI string translations — single source of truth for all user-facing copy
// wednesday-dev: update here when copy changes, never hardcode strings in components

export const HOME_SECTION_TITLES = {
  trendingSongs: {
    home: "🔥 Trending Right Now",
    songs: "Trending Songs",
  },
  topAlbums: {
    home: "💿 Top Albums",
    albums: "Top Albums",
  },
  popularArtists: {
    home: "🎤 Popular Artists",
    artists: "Popular Artists",
  },
} as const

export const SEARCH_SUGGESTIONS = [
  "Kanye West",
  "Bohemian Rhapsody",
  "Taylor Swift",
  "Dark Side of the Moon",
  "Kendrick Lamar",
  "Hotel California",
  "Daft Punk",
  "Abbey Road",
] as const

export const AUTH_TEXT = {
  signIn: "Sign in",
  signInLabel: "Sign in to your account",
} as const

// Returns the title for a section based on the current active view.
// Falls back to the "home" variant if the view has no dedicated title.
export function getSectionTitle(
  titles: Partial<Record<string, string>>,
  activeView: string
): string {
  return titles[activeView] ?? titles["home"] ?? ""
}
