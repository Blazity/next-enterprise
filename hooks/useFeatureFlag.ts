import { useFeatureFlagVariantKey } from "posthog-js/react"

const IS_DEV = process.env.NODE_ENV === "development"

/**
 * Wraps PostHog's `useFeatureFlagVariantKey` so that every flag
 * resolves to its active variant (`"on"`) in development mode,
 * removing the need for a live PostHog connection while developing.
 */
export function useFeatureFlag(flag: string): string | boolean | undefined {
  const variant = useFeatureFlagVariantKey(flag)
  if (IS_DEV) return "on"
  return variant
}
