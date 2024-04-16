"use client"
import { useEffect, useState } from "react"
import { useRef } from "react"

const MouseTrackingGlowEffect: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY })
    }

    const handleMouseEnter = () => {
      setIsHovered(true)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
    }

    const container = containerRef.current

    if (container) {
      container.addEventListener("mousemove", handleMouseMove)
      container.addEventListener("mouseenter", handleMouseEnter)
      container.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove)
        container.removeEventListener("mouseenter", handleMouseEnter)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="relative h-screen w-screen overflow-hidden">
      <div
        className={`absolute left-0 top-0 h-64 w-64 rounded-full bg-blue-500 filter ${
          isHovered ? "blur-xl" : "blur-none"
        }`}
        style={{
          transform: `translate(${position.x - 32}px, ${position.y - 32}px)`,
        }}
      ></div>
    </div>
  )
}

export default MouseTrackingGlowEffect
