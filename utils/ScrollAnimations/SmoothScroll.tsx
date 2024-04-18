import React, { useRef, useState, useCallback, useLayoutEffect } from "react"
import ResizeObserver from "resize-observer-polyfill"
import { useScroll, useTransform, useSpring, motion } from "framer-motion"

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef(null)

  const [pageHeight, setPageHeight] = useState(0)
  const resizePageHeight = useCallback((entries: ResizeObserverEntry[]) => {
    for (let entry of entries) {
      setPageHeight(entry.contentRect.height)
    }
  }, [])

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => resizePageHeight(entries))
    scrollRef.current && resizeObserver.observe(scrollRef.current)
  }, [scrollRef, resizePageHeight])

  const { scrollY } = useScroll()
  const transform = useTransform(scrollY, [0, pageHeight], [0, -pageHeight])
  const physics = { damping: 15, mass: 0.27, stiffness: 55 }
  const spring = useSpring(transform, physics)

  return (
    <>
      <motion.div ref={scrollRef} style={{ y: spring }} className="scroll-container">
        {children}
      </motion.div>
    </>
  )
}

export default SmoothScroll
