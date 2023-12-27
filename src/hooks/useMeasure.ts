"use client"
import { ResizeObserver } from "@juggle/resize-observer"
import { useEffect, useRef, useState } from "react"

export default function useMeasure<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)
  const [bounds, setBounds] = useState({ left: 0, top: 0, width: 0, height: 0 })
  const [ro] = useState(
    () =>
      new ResizeObserver(([entry]) => {
        if (entry) {
          return setBounds(entry.contentRect)
        }
      })
  )
  useEffect(() => {
    if (ref.current) ro.observe(ref.current)
    return () => ro.disconnect()
  }, [ro])
  return [{ ref }, bounds] as const
}
