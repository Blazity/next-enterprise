"use client"

import { useAppStore } from "store"

export function Counter() {
  const count = useAppStore((s) => s.count)
  const increment = useAppStore((s) => s.increment)
  const decrement = useAppStore((s) => s.decrement)
  const reset = useAppStore((s) => s.reset)

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={decrement}
        className="rounded-lg bg-gray-200 px-4 py-2 text-lg font-bold text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
      >
        -
      </button>
      <span className="min-w-12 text-center text-2xl font-bold dark:text-white">{count}</span>
      <button
        onClick={increment}
        className="rounded-lg bg-blue-500 px-4 py-2 text-lg font-bold text-white hover:bg-blue-600"
      >
        +
      </button>
      <button
        onClick={reset}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        Reset
      </button>
    </div>
  )
}
