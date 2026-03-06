import { useEffect, useRef, useState } from "react"

import { DELETING_SPEED, PAUSE_AFTER_DELETING, PAUSE_AFTER_TYPING, TYPING_SPEED } from "lib/constants"
import { SEARCH_SUGGESTIONS } from "lib/translations"
import { ternary } from "lib/utils"

export function useTypingPlaceholder() {
  const [text, setText] = useState("")
  const indexRef = useRef(0)
  const isDeletingRef = useRef(false)

  useEffect(() => {
    const current = SEARCH_SUGGESTIONS[indexRef.current] ?? SEARCH_SUGGESTIONS[0]

    if (!isDeletingRef.current && text === current) {
      const timeout = setTimeout(() => {
        isDeletingRef.current = true
        setText((prev) => prev.slice(0, -1))
      }, PAUSE_AFTER_TYPING)
      return () => clearTimeout(timeout)
    }

    if (isDeletingRef.current && text === "") {
      const timeout = setTimeout(() => {
        indexRef.current = (indexRef.current + 1) % SEARCH_SUGGESTIONS.length
        isDeletingRef.current = false
        const next = SEARCH_SUGGESTIONS[indexRef.current] ?? SEARCH_SUGGESTIONS[0]
        setText(next.slice(0, 1))
      }, PAUSE_AFTER_DELETING)
      return () => clearTimeout(timeout)
    }

    const speed = ternary(isDeletingRef.current, DELETING_SPEED, TYPING_SPEED)
    const timeout = setTimeout(() => {
      setText(
        ternary(isDeletingRef.current, current.slice(0, text.length - 1), current.slice(0, text.length + 1))
      )
    }, speed)

    return () => clearTimeout(timeout)
  }, [text])

  return text
}
