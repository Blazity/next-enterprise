"use client"

import { useCounterStore } from "@/lib/store/counterStore"

export function CounterExample() {
  const { count, increment, decrement, reset } = useCounterStore()

  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <div className="bg-primary-100 dark:bg-primary-900 flex size-16 items-center justify-center rounded-full text-blue-700 lg:size-20">
        <span className="text-2xl font-extrabold lg:text-3xl">{count}</span>
      </div>
      <h3 className="text-xl font-bold dark:text-white">Counter</h3>
      <p className="text-gray-500 dark:text-gray-400">A simple counter powered by Zustand state management.</p>
      <div className="inline-flex gap-3">
        <button
          onClick={increment}
          className="inline-flex min-w-20 items-center justify-center rounded-xl border border-blue-400 bg-blue-400 px-4 py-2.5 text-center text-white transition-colors delay-50 hover:enabled:bg-blue-700"
        >
          Increment
        </button>
        <button
          onClick={decrement}
          className="inline-flex min-w-20 items-center justify-center rounded-xl border border-blue-400 bg-transparent px-4 py-2.5 text-center text-blue-400 transition-colors delay-50 hover:enabled:bg-blue-400 hover:enabled:text-white"
        >
          Decrement
        </button>
        <button
          onClick={reset}
          className="inline-flex min-w-20 items-center justify-center rounded-xl border border-blue-400 bg-transparent px-4 py-2.5 text-center text-blue-400 transition-colors delay-50 hover:enabled:bg-blue-400 hover:enabled:text-white"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
