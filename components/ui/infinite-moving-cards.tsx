"use client"

import React, { useEffect, useRef, useState } from "react"

import { motion, useAnimationFrame, useMotionValue } from "framer-motion"

import { cn } from "@/lib/utils"

export const InfiniteMovingCards = ({
  items,
  renderItem,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}: {
  items: unknown[]
  renderItem: (item: unknown, idx: number) => React.ReactNode
  direction?: "left" | "right"
  speed?: "fast" | "normal" | "slow"
  pauseOnHover?: boolean
  className?: string
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLUListElement>(null)
  
  const [contentWidth, setContentWidth] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const x = useMotionValue(0)

  // Calculate speed multiplier
  const baseSpeed = speed === "fast" ? 100 : speed === "normal" ? 40 : 20
  const speedMultiplier = direction === "left" ? -baseSpeed : baseSpeed

  useEffect(() => {
    if (scrollerRef.current) {
      // Get the width of ONE set of items
      const width = Array.from(scrollerRef.current.children).reduce(
        (acc, child) => acc + (child as HTMLElement).offsetWidth + 16, // 16px is gap-4
        0
      )
      // Since we duplicate the items once, the full scrollable width is `width`
      setContentWidth(width / 2)
    }
  }, [items])

  useAnimationFrame((t, delta) => {
    if (pauseOnHover && (isHovered || isDragging)) return
    if (contentWidth === 0) return

    const moveBy = (speedMultiplier * delta) / 1000
    let newX = x.get() + moveBy

    // Loop the scrolling seamlessly
    if (direction === "left" && newX <= -contentWidth) {
      newX += contentWidth
    } else if (direction === "right" && newX >= 0) {
      newX -= contentWidth
    }

    x.set(newX)
  })

  // Duplicate items to create infinite loop effect seamlessly
  const duplicatedItems = [...items, ...items]

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.ul
        ref={scrollerRef}
        drag="x"
        dragConstraints={{
          right: 0,
          left: -contentWidth,
        }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        style={{ x }}
        className="flex w-max shrink-0 cursor-grab active:cursor-grabbing flex-nowrap gap-4 py-4"
      >
        {duplicatedItems.map((item, idx) => (
          <li className="w-40 shrink-0" key={idx}>
            {renderItem(item, idx)}
          </li>
        ))}
      </motion.ul>
    </div>
  )
}

