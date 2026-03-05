// App-level utils — non-iTunes, reusable across the app

import type { ActiveView } from "lib/constants"

// Returns true when the active view shows HomeContent (i.e. not the search results view)
export function isHomeView(view: ActiveView): view is Exclude<ActiveView, "search"> {
  return view !== "search"
}

// Returns true if the given section should be visible for the current activeView.
// Sections are always visible on "home"; otherwise only their own dedicated view shows them.
export function isVisibleInView(activeView: string, sectionView: string): boolean {
  return activeView === "home" || activeView === sectionView
}

// Generic ternary util — returns onTrue or onFalse based on condition
export function ternary<T>(condition: boolean, onTrue: T, onFalse: T): T {
  return condition ? onTrue : onFalse
}
