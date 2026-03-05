// App-level constants — non-iTunes, non-i18n

export const ACTIVE_VIEWS = ["home", "search", "songs", "albums", "artists"] as const
export type ActiveView = (typeof ACTIVE_VIEWS)[number]
