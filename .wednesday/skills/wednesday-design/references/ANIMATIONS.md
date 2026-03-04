# Animation Patterns Reference

Standardized animation patterns for Wednesday Solutions projects. Use these patterns to create consistent, performant, and delightful animations.

## Core Principles

1. **Purpose over decoration** - Every animation should serve a purpose (feedback, state change, hierarchy)
2. **Performance first** - Use `transform` and `opacity` for GPU-accelerated animations
3. **Respect user preferences** - Honor `prefers-reduced-motion`
4. **Consistent timing** - Use standardized easing and duration tokens

## Easing Functions

### Standard Easings (CSS)

```typescript
const easings = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
}
```

### Custom Cubic-Bezier Functions

```typescript
// Smooth deceleration - great for entrances
const easeOutCubic = 'cubic-bezier(0.33, 1, 0.68, 1)'
// Also as JS function:
const easeOutCubicFn = (t: number) => 1 - Math.pow(1 - t, 3)

// Stronger deceleration - prominent entrances
const easeOutQuart = 'cubic-bezier(0.25, 1, 0.5, 1)'
const easeOutQuartFn = (t: number) => 1 - Math.pow(1 - t, 4)

// Symmetric in/out - morphing, state changes
const easeInOutQuart = 'cubic-bezier(0.76, 0, 0.24, 1)'
const easeInOutQuartFn = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2

// Overshoot - playful bouncy feel
const easeOutBack = 'cubic-bezier(0.34, 1.56, 0.64, 1)'
const easeOutBackFn = (t: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

// Spring-like - natural motion
const spring = 'cubic-bezier(0.4, 0, 0.2, 1)'
```

### Usage Guidelines

| Easing | Best For |
|--------|----------|
| `easeOutCubic` | Element entrances, fade ins |
| `easeOutQuart` | Prominent reveals, hero animations |
| `easeInOutQuart` | Morphing, phase transitions |
| `easeOutBack` | Badges, buttons, playful elements |
| `spring` | Interactive feedback, hover states |

## Keyframe Animations

### Pulse Animation

Subtle attention-drawing effect for live indicators and status dots.

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* Usage */
.live-indicator {
  animation: pulse 2s ease-in-out infinite;
}
```

### Float Animation

Gentle vertical floating for hero elements and device mockups.

```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

/* Usage */
.floating-element {
  animation: float 6s ease-in-out infinite;
}
```

### Breathe Animation

Subtle scale pulsing for spotlight/glow effects.

```css
@keyframes breathe {
  0%, 100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.08);
  }
}

/* Usage - centered elements */
.spotlight {
  animation: breathe 3s ease-in-out infinite;
}
```

### Mega Pulse Animation

Larger scale pulse for ambient glows.

```css
@keyframes megaPulse {
  0%, 100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1.03);
  }
}

/* Usage */
.ambient-glow {
  animation: megaPulse 4s ease-in-out infinite;
}
```

### Shimmer Animation

Premium shimmer effect for buttons and badges.

```css
@keyframes shimmer {
  0% { left: -100%; }
  50%, 100% { left: 200%; }
}

/* Usage - inside element with overflow: hidden */
.shimmer-overlay {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
  animation: shimmer 2.5s ease-in-out infinite;
}
```

### Text Reveal Animation

Word-by-word or character reveal effect.

```css
@keyframes textReveal {
  0% {
    opacity: 0;
    transform: translateY(8px);
    filter: blur(4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}
```

### Draw Circle Animation

SVG stroke animation for hand-drawn effects.

```css
@keyframes drawCircle {
  0% { stroke-dashoffset: 1000; }
  100% { stroke-dashoffset: 0; }
}

/* Usage on SVG path */
.hand-drawn-circle {
  stroke-dasharray: 350;
  stroke-dashoffset: 350;
  animation: drawCircle 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
```

## Scroll-Driven Animations

### Progress Tracking Hook

```typescript
import { useState, useEffect, useRef } from 'react'

function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const scrollTop = window.scrollY
      const scrollHeight = container.scrollHeight - window.innerHeight
      const progress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1)

      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { scrollProgress, containerRef }
}
```

### Phase-Based Animation

```typescript
interface AnimationPhase {
  start: number      // Scroll progress (0-1) when phase begins
  end: number        // Scroll progress (0-1) when phase ends
  easing?: (t: number) => number
}

function usePhaseProgress(
  scrollProgress: number,
  phase: AnimationPhase
): number {
  const { start, end, easing = (t) => t } = phase
  const rawProgress = Math.min(1, Math.max(0, (scrollProgress - start) / (end - start)))
  return easing(rawProgress)
}

// Example usage
function AnimatedElement({ scrollProgress }: { scrollProgress: number }) {
  // Element fades in from scroll 0.2 to 0.4
  const fadeProgress = usePhaseProgress(scrollProgress, {
    start: 0.2,
    end: 0.4,
    easing: easeOutCubic,
  })

  return (
    <div style={{
      opacity: fadeProgress,
      transform: `translateY(${(1 - fadeProgress) * 30}px)`,
    }}>
      Content
    </div>
  )
}
```

### Staggered Animation

```typescript
interface StaggerConfig {
  totalItems: number
  baseDelay: number      // ms
  staggerDelay: number   // ms between each item
}

function useStaggeredAnimation(
  isActive: boolean,
  config: StaggerConfig
) {
  const { totalItems, baseDelay, staggerDelay } = config

  return Array.from({ length: totalItems }, (_, index) => ({
    opacity: isActive ? 1 : 0,
    transform: isActive ? 'translateY(0)' : 'translateY(12px)',
    transition: `opacity 0.5s ease, transform 0.5s ease`,
    transitionDelay: isActive ? `${baseDelay + (index * staggerDelay)}ms` : '0ms',
  }))
}

// Example: Text Generate Effect
function TextGenerateEffect({
  text,
  isActive,
  delay = 0,
  staggerDelay = 80,
}: {
  text: string
  isActive: boolean
  delay?: number
  staggerDelay?: number
}) {
  const words = text.split(' ')

  return (
    <span>
      {words.map((word, index) => (
        <span
          key={index}
          style={{
            display: 'inline-block',
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'translateY(0)' : 'translateY(12px)',
            filter: isActive ? 'blur(0)' : 'blur(4px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease, filter 0.5s ease',
            transitionDelay: isActive ? `${delay + (index * staggerDelay)}ms` : '0ms',
            marginRight: '0.3em',
          }}
        >
          {word}
        </span>
      ))}
    </span>
  )
}
```

## Interaction Animations

### Hover State Transitions

```typescript
// Card hover lift
const cardHover = {
  default: {
    transform: 'translateY(0)',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  hovered: {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
  },
}

// Button hover
const buttonHover = {
  default: {
    transform: 'translateY(0) scale(1)',
    transition: 'all 0.15s ease',
  },
  hovered: {
    transform: 'translateY(-2px) scale(1.02)',
  },
  pressed: {
    transform: 'translateY(2px) scale(0.98)',
  },
}

// Icon/badge bounce
const bounceHover = {
  default: {
    transform: 'scale(1)',
    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  hovered: {
    transform: 'scale(1.1)',
  },
}
```

### Button Press States

```typescript
function usePressState() {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const handlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => {
      setIsHovered(false)
      setIsPressed(false)
    },
    onMouseDown: () => setIsPressed(true),
    onMouseUp: () => setIsPressed(false),
  }

  return { isHovered, isPressed, handlers }
}
```

## SVG Animations

### Hand-Drawn Circle

```typescript
function HandDrawnCircle({
  isActive,
  delay = 0,
}: {
  isActive: boolean
  delay?: number
}) {
  return (
    <svg
      viewBox="0 0 100 50"
      fill="none"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(100% + 24px)',
        height: 'calc(100% + 24px)',
        pointerEvents: 'none',
      }}
    >
      {/* Main circle */}
      <ellipse
        cx="50"
        cy="25"
        rx="48"
        ry="22"
        stroke="#4ADE80"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        style={{
          strokeDasharray: 350,
          strokeDashoffset: isActive ? 0 : 350,
          transition: `stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
        }}
      />
      {/* Sketch effect - offset stroke */}
      <ellipse
        cx="50"
        cy="25"
        rx="47"
        ry="21"
        stroke="#4ADE80"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        style={{
          strokeDasharray: 340,
          strokeDashoffset: isActive ? 0 : 340,
          transition: `stroke-dashoffset 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${delay + 0.15}s`,
          opacity: 0.5,
        }}
      />
    </svg>
  )
}
```

### Hand-Drawn Underline

```typescript
function HandDrawnUnderline({
  isActive,
  delay = 0,
}: {
  isActive: boolean
  delay?: number
}) {
  return (
    <svg
      viewBox="0 0 200 20"
      fill="none"
      style={{
        position: 'absolute',
        bottom: '-4px',
        left: '-2%',
        width: '104%',
        height: '16px',
        pointerEvents: 'none',
      }}
    >
      <path
        d="M 5 10 Q 30 14, 60 9 T 120 11 T 195 8"
        stroke="#4ADE80"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        style={{
          strokeDasharray: 300,
          strokeDashoffset: isActive ? 0 : 300,
          transition: `stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
        }}
      />
    </svg>
  )
}
```

## Performance Best Practices

### GPU-Accelerated Properties

Only animate these properties for smooth 60fps:

```typescript
// Good - GPU accelerated
const gpuAnimated = {
  transform: 'translateX(100px) scale(1.1) rotate(45deg)',
  opacity: 0.5,
}

// Avoid - triggers layout/paint
const layoutTriggers = {
  width: '100px',      // Triggers layout
  height: '100px',     // Triggers layout
  top: '10px',         // Triggers layout
  left: '10px',        // Triggers layout
  margin: '10px',      // Triggers layout
  padding: '10px',     // Triggers layout
  borderWidth: '2px',  // Triggers paint
  backgroundColor: '', // Triggers paint
}
```

### Will-Change Optimization

```typescript
// Apply during animation only
const animatingElement = {
  willChange: 'transform, opacity',
}

// Remove after animation completes
// Or use: will-change: auto;
```

### Reduced Motion Support

```typescript
// CSS
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// React hook
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}
```

## Animation Timing Cheat Sheet

| Animation Type | Duration | Easing |
|----------------|----------|--------|
| Micro-interactions | 100-150ms | ease |
| Button states | 150ms | ease |
| Hover effects | 200-300ms | spring |
| Card transitions | 300ms | easeOutCubic |
| Modal open | 300ms | easeOutQuart |
| Modal close | 200ms | easeIn |
| Page transitions | 400-500ms | easeInOutQuart |
| Scroll reveals | 500-800ms | easeOutQuart |
| Loading animations | 1-2s | linear (loop) |
| Ambient effects | 3-6s | easeInOut (loop) |
