---
name: wednesday-design
description: Design and UX guidelines for Wednesday Solutions projects. Covers visual design tokens, animation patterns, component standards, accessibility, and user experience best practices for React/Next.js applications. ENFORCES use of approved component libraries only.
license: MIT
metadata:
  author: wednesday-solutions
  version: "1.0"
compatibility: React 18+, Next.js 14+, Tailwind CSS, Framer Motion
---

# Wednesday Design & UX Guidelines

This skill establishes design and user experience standards for Wednesday Solutions projects. Follow these guidelines to create consistent, accessible, and delightful user interfaces.

---

## ⚠️ CRITICAL: APPROVED COMPONENT LIBRARY ONLY

**THIS IS A MANDATORY REQUIREMENT. NO EXCEPTIONS.**

### The Rule

**DO NOT create custom UI components.** All UI elements MUST be sourced from the approved component library containing **492+ pre-vetted components** from 8 libraries.

### Why This Matters

1. **Consistency** - Pre-built components ensure visual coherence across all projects
2. **Quality** - These components are battle-tested, accessible, and performant
3. **Speed** - No time wasted reinventing existing solutions
4. **Maintenance** - Upstream updates benefit all projects

### Approved Libraries (Priority Order)

| Priority | Library | URL | Use For |
|----------|---------|-----|---------|
| 1 | **shadcn/ui** | https://ui.shadcn.com | Foundation (forms, dialogs, data) |
| 2 | **Aceternity UI** | https://ui.aceternity.com | Effects, backgrounds, 3D, scroll |
| 3 | **Magic UI** | https://magicui.design | Text animations, buttons, mockups |
| 4 | **Motion Primitives** | https://motion-primitives.com | Morphing, text effects |
| 5 | **Animate UI** | https://animate-ui.com | Animated Radix ports |
| 6 | **Eldora UI** | https://www.eldoraui.site | Device mockups, text |
| 7 | **Cult UI** | https://www.cult-ui.com | Neumorphic, textures |
| 8 | **ABUI** | https://www.abui.io | Timeline, availability |

### Before Writing ANY Component

```
┌─────────────────────────────────────────────────────────────┐
│  STOP! Ask yourself:                                        │
│                                                             │
│  1. Does this component exist in the approved library?      │
│     └─> YES: Use it. STOP here.                             │
│     └─> NO: Continue to step 2                              │
│                                                             │
│  2. Can I combine 2-3 approved components to achieve this?  │
│     └─> YES: Compose them. STOP here.                       │
│     └─> NO: Continue to step 3                              │
│                                                             │
│  3. Can I extend an approved component's styles only?       │
│     └─> YES: Extend styles using design tokens. STOP here.  │
│     └─> NO: Escalate to tech lead for approval              │
│                                                             │
│  ❌ NEVER create a component from scratch                   │
└─────────────────────────────────────────────────────────────┘
```

### Violation Examples

```typescript
// ❌ WRONG - Creating custom button
function CustomButton({ children }) {
  return <button className="bg-green-500 ...">{children}</button>
}

// ✅ CORRECT - Using approved library
import { ShimmerButton } from '@/components/magicui/shimmer-button'
// or
import { Button } from '@/components/ui/button'
```

```typescript
// ❌ WRONG - Creating custom card animation
function AnimatedCard({ children }) {
  return <motion.div whileHover={{ scale: 1.05 }}>{children}</motion.div>
}

// ✅ CORRECT - Using approved library
import { WobbleCard } from '@/components/aceternity/wobble-card'
// or
import { MagicCard } from '@/components/magicui/magic-card'
```

```typescript
// ❌ WRONG - Creating custom text animation
function TypewriterText({ text }) {
  // custom implementation...
}

// ✅ CORRECT - Using approved library
import { TypewriterEffect } from '@/components/aceternity/typewriter-effect'
// or
import { TypingAnimation } from '@/components/magicui/typing-animation'
```

### Quick Lookup by Need

| I need... | Use this component | From |
|-----------|-------------------|------|
| Basic button | Button | shadcn/ui |
| Shimmer button | Shimmer Button | Magic UI |
| 3D tilt card | 3D Card Effect | Aceternity |
| Spotlight card | Magic Card | Magic UI |
| Word-by-word text | Text Generate Effect | Aceternity |
| Typing animation | Typewriter Effect | Aceternity |
| Modal/dialog | Dialog | shadcn/ui |
| Morphing modal | Morphing Dialog | Motion Primitives |
| Form inputs | Input, Select, etc. | shadcn/ui |
| Background effects | Background Beams, Aurora, etc. | Aceternity |
| Device mockup | iPhone, Safari, etc. | Magic UI / Eldora UI |
| Carousel | Carousel | shadcn/ui / Aceternity |
| Data table | Data Table | shadcn/ui |

**See [references/COMPONENT-LIBRARY.md](references/COMPONENT-LIBRARY.md) for the complete index of 492+ approved components.**

---

## 1. Visual Design Principles

### Brand Identity

- **Primary palette**: Green (#4ADE80) to Teal (#0D9488) gradient
- **Typography**: Instrument Serif for display, DM Sans for body
- **Aesthetic**: Premium, minimal, with subtle depth and glow effects

### Design Hierarchy

1. **Primary actions** - Green gradient with glow
2. **Secondary actions** - Outlined, neutral
3. **Content** - Cards with subtle elevation
4. **Background** - Dot patterns, spotlights, gradients

### Spacing System

Use a 4px base grid:
- Small gaps: `8px`, `12px`
- Medium gaps: `16px`, `24px`
- Large gaps: `32px`, `48px`
- Section spacing: `56px`

See [references/TOKENS.md](references/TOKENS.md) for complete token definitions.

## 2. Typography Guidelines

### Hierarchy

```
Display XL: 60px - Hero headlines
Display LG: 44px - Section headlines
Display MD: 38px - Feature headlines
Display SM: 28px - Card headlines

Body LG: 18px - Lead paragraphs
Body MD: 16px - Standard body text
Body SM: 14px - Supporting text
Body XS: 12px - Captions, labels
```

### Font Pairing

```typescript
// Display/Headlines - elegant, editorial feel
fontFamily: "'Instrument Serif', Georgia, serif"

// Body/UI - clean, readable
fontFamily: "'DM Sans', -apple-system, sans-serif"
```

### Text Styling Rules

1. **Headlines** use Instrument Serif, normal weight, negative letter-spacing
2. **Body** uses DM Sans, regular to semibold weights
3. **Labels/Overlines** are uppercase with expanded letter-spacing (0.1em+)
4. **Emphasized text** in headlines uses italic style
5. **Muted text** uses `#71717A` color

## 3. Color Usage

### Semantic Colors

| Purpose | Color | Usage |
|---------|-------|-------|
| Primary | `#4ADE80` | CTAs, active states, success |
| Secondary | `#0D9488` | Accents, links, secondary actions |
| Text Primary | `#18181B` | Headlines, important text |
| Text Secondary | `#71717A` | Body text, descriptions |
| Text Muted | `#A3A3A3` | Captions, placeholders |
| Background | `#FFFFFF` | Primary background |
| Surface | `#F5F5F5` | Cards, elevated surfaces |

### Gradient Usage

- **Brand gradient**: `linear-gradient(135deg, #4ADE80 0%, #0D9488 100%)`
- Use for primary CTAs, badges, icons
- Never use flat colors for primary actions

### Dark Cards

For AI/system messages or contrast:
- Background: `linear-gradient(135deg, #18181B 0%, #27272A 100%)`
- Text: White (#FFFFFF) with muted gray (#A3A3A3) for descriptions

## 4. Animation Principles

### Core Rules

1. **Purpose-driven** - Every animation serves a purpose (feedback, hierarchy, delight)
2. **Performance-first** - Only animate `transform` and `opacity`
3. **Consistent timing** - Use standardized easings and durations
4. **Respect preferences** - Honor `prefers-reduced-motion`

### Timing Guidelines

| Type | Duration | Easing |
|------|----------|--------|
| Micro-interactions | 100-150ms | ease |
| Hover states | 200-300ms | spring |
| Card transitions | 300ms | easeOutCubic |
| Page transitions | 400-500ms | easeInOutQuart |
| Scroll reveals | 500-800ms | easeOutQuart |
| Ambient effects | 3-6s | easeInOut (loop) |

### Scroll-Driven Animations

For landing pages and storytelling:

1. Use scroll progress (0-1) to drive animations
2. Define clear phase thresholds for content reveals
3. Stagger elements within each phase
4. Provide fallbacks for reduced motion

See [references/ANIMATIONS.md](references/ANIMATIONS.md) for implementation patterns.

## 5. Component Standards

### Cards

- **Border radius**: 24px for cards, 14px for buttons
- **Padding**: 22px standard, 28px for prominent cards
- **Shadows**: Layered shadows with optional glow
- **Hover**: Lift effect (-8px) with enhanced shadow

### Buttons

Primary buttons should have:
- 3D gradient background (not flat)
- Top highlight line
- Shimmer animation
- Press/hover states with transform feedback
- Arrow icon that animates on hover

### Badges

Premium badges include:
- Subtle gradient background
- Pulse dot for "live" states
- Shimmer effect
- Rounded pill shape (100px radius)

See [references/COMPONENTS.md](references/COMPONENTS.md) for code patterns.

## 6. Interaction Design

### Hover States

| Element | Hover Effect |
|---------|--------------|
| Cards | Lift -8px, glow shadow |
| Buttons | Lift -2px, enhanced shadow |
| Links | Color shift to primary |
| Icons | Scale 1.1, optional rotation |

### Press States

- Scale down slightly (0.98)
- Reduce shadow depth
- Darken background
- Remove shimmer/highlight effects

### Focus States

- Visible focus ring (`0 0 0 2px primary-color`)
- Never remove outline without alternative
- High contrast for keyboard navigation

## 7. Layout Patterns

### Hero Sections

```
┌────────────────────────────────────────┐
│ Navigation (fixed)                     │
├──────────────────┬─────────────────────┤
│                  │                     │
│  Copy            │      Visual         │
│  - Badge         │      (Phone/       │
│  - Headline      │       Device)       │
│  - Body          │                     │
│  - CTA           │                     │
│  - Social proof  │                     │
│                  │                     │
└──────────────────┴─────────────────────┘
```

### Comparison Sections

```
┌────────────────────────────────────────┐
│                                        │
│  Old way (strikethrough)               │
│  New way (highlighted, circled)        │
│  Description                           │
│                                        │
│  [Repeat for each comparison]          │
│                                        │
│                    [Floating cards] ───│
│                                        │
└────────────────────────────────────────┘
```

### Step/Process Sections

```
┌────────────────────────────────────────┐
│           Section Header               │
│           Overline · Headline          │
│                                        │
│   ┌─────┐   ┌─────┐   ┌─────┐         │
│   │ 01  │───│ 02  │───│ 03  │         │
│   │Card │   │Card │   │Card │         │
│   └─────┘   └─────┘   └─────┘         │
│                                        │
└────────────────────────────────────────┘
```

## 8. Accessibility Requirements

### Color Contrast

- Text on backgrounds: Minimum 4.5:1 ratio
- Large text (24px+): Minimum 3:1 ratio
- UI components: Minimum 3:1 ratio

### Motion Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Keyboard Navigation

- All interactive elements must be focusable
- Tab order follows visual order
- Focus indicators are always visible
- Escape closes modals/dropdowns

### Screen Readers

- Images have descriptive alt text
- Icons have aria-labels
- Dynamic content uses aria-live regions
- Form fields have associated labels

## 9. Responsive Design

### Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
}
```

### Mobile Considerations

- Touch targets minimum 44x44px
- Increased font sizes for readability
- Simplified animations
- Stack layouts vertically
- Hide decorative elements

## 10. Performance Guidelines

### Image Optimization

- Use `next/image` for automatic optimization
- Provide width/height to prevent layout shift
- Use WebP format with JPEG fallback
- Lazy load below-the-fold images

### Animation Performance

- Only animate `transform` and `opacity`
- Use `will-change` sparingly during active animations
- Debounce scroll handlers
- Use `requestAnimationFrame` for JS animations

### CSS Best Practices

- Minimize use of `filter` and `backdrop-filter`
- Avoid animating `box-shadow` (use opacity on pseudo-element)
- Use CSS containment where appropriate

## Quick Reference

### Do's

- Use gradients for primary actions
- Add subtle glow effects to featured elements
- Include hover/press state feedback
- Use staggered animations for lists
- Test with keyboard navigation
- Provide loading/skeleton states

### Don'ts

- **Create custom components** - Use approved library ONLY
- **Reinvent existing solutions** - Check library first
- Use flat colors for CTAs
- Skip hover states on interactive elements
- Animate layout properties (width, height, margin)
- Ignore reduced motion preferences
- Create text with insufficient contrast
- Use autoplay video without controls

---

## Reference Documents

| Document | Purpose |
|----------|---------|
| [references/COMPONENT-LIBRARY.md](references/COMPONENT-LIBRARY.md) | **492+ approved components** - CHECK THIS FIRST |
| [references/TOKENS.md](references/TOKENS.md) | Design tokens (colors, typography, spacing) |
| [references/ANIMATIONS.md](references/ANIMATIONS.md) | Animation patterns and easing functions |
| [references/COMPONENTS.md](references/COMPONENTS.md) | Component styling patterns |

---

## Enforcement Checklist

Before submitting any PR with UI changes:

- [ ] All components sourced from approved library
- [ ] No custom component implementations
- [ ] Design tokens used for any style overrides
- [ ] Accessibility requirements met
- [ ] Animation performance guidelines followed
- [ ] Responsive design verified
