# Design Tokens Reference

Standardized design tokens for Wednesday Solutions projects. These tokens ensure visual consistency across all applications.

## Color System

### Brand Colors

```typescript
const colors = {
  // Primary - Green gradient spectrum
  primary: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',  // Primary accent
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  // Secondary - Teal spectrum
  secondary: {
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',  // Secondary accent
    700: '#0F766E',
    800: '#115E59',
  },

  // Neutrals - Zinc spectrum
  neutral: {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A',  // Body text
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',  // Headings
    950: '#09090B',
  },

  // Semantic colors
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#EF4444',
  info: '#3B82F6',
}
```

### Gradient Presets

```typescript
const gradients = {
  // Primary brand gradient
  primary: 'linear-gradient(135deg, #4ADE80 0%, #0D9488 100%)',

  // Subtle backgrounds
  primarySubtle: 'linear-gradient(135deg, rgba(74, 222, 128, 0.08) 0%, rgba(13, 148, 136, 0.08) 100%)',

  // Card backgrounds
  darkCard: 'linear-gradient(135deg, #18181B 0%, #27272A 100%)',
  lightCard: 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)',

  // Button states
  buttonDefault: 'linear-gradient(180deg, #4ADE80 0%, #3ACC72 50%, #2AB862 100%)',
  buttonHover: 'linear-gradient(180deg, #3BD975 0%, #2EBE68 50%, #25A85C 100%)',
  buttonPressed: 'linear-gradient(180deg, #1D8B54 0%, #2AA06A 50%, #34D480 100%)',

  // Glow effects
  glowPrimary: 'radial-gradient(circle, rgba(74, 222, 128, 0.2) 0%, transparent 70%)',
  glowSecondary: 'radial-gradient(circle, rgba(13, 148, 136, 0.15) 0%, transparent 70%)',

  // Rim lights (for device mockups)
  rimLeft: 'linear-gradient(180deg, transparent 0%, rgba(74, 222, 128, 0.8) 20%, rgba(74, 222, 128, 1) 50%, rgba(74, 222, 128, 0.8) 80%, transparent 100%)',
  rimRight: 'linear-gradient(180deg, transparent 0%, rgba(13, 148, 136, 0.7) 20%, rgba(13, 148, 136, 0.9) 50%, rgba(13, 148, 136, 0.7) 80%, transparent 100%)',
}
```

## Typography

### Font Families

```typescript
const fonts = {
  // Display/Headings - Elegant serif
  display: "'Instrument Serif', Georgia, serif",

  // Body/UI - Clean sans-serif
  body: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",

  // Monospace (code)
  mono: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
}

// Google Fonts import
// @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');
```

### Type Scale

```typescript
const typography = {
  // Display headings (Instrument Serif)
  display: {
    xl: { fontSize: '60px', lineHeight: 1.08, letterSpacing: '-0.02em' },
    lg: { fontSize: '44px', lineHeight: 1.15, letterSpacing: '-0.02em' },
    md: { fontSize: '38px', lineHeight: 1.2, letterSpacing: '-0.01em' },
    sm: { fontSize: '28px', lineHeight: 1.3, letterSpacing: '-0.01em' },
  },

  // Body text (DM Sans)
  body: {
    xl: { fontSize: '20px', lineHeight: 1.5 },
    lg: { fontSize: '18px', lineHeight: 1.7 },
    md: { fontSize: '16px', lineHeight: 1.6 },
    sm: { fontSize: '14px', lineHeight: 1.6 },
    xs: { fontSize: '12px', lineHeight: 1.5 },
  },

  // Labels & overlines
  label: {
    lg: { fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em' },
    md: { fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em' },
    sm: { fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em' },
  },
}
```

### Font Weights

```typescript
const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
}
```

## Spacing

### Base Scale (4px grid)

```typescript
const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
}
```

### Component Spacing

```typescript
const componentSpacing = {
  // Card padding
  cardPadding: {
    sm: '14px',
    md: '18px',
    lg: '22px',
    xl: '28px',
  },

  // Section spacing
  sectionPadding: '56px',

  // Navigation padding
  navPadding: '28px 56px',

  // Button padding
  buttonPadding: {
    sm: '10px 20px',
    md: '14px 28px',
    lg: '20px 40px',
  },

  // Badge padding
  badgePadding: '10px 18px 10px 14px',
}
```

## Border Radius

```typescript
const borderRadius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '10px',
  xl: '14px',
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px',

  // Component-specific
  button: '14px',
  card: '24px',
  badge: '100px',
  avatar: '50%',
  input: '8px',

  // Device mockups
  phoneOuter: '52px',
  phoneInner: '42px',
}
```

## Shadows

### Elevation System

```typescript
const shadows = {
  // Subtle elevation
  sm: '0 2px 8px rgba(0, 0, 0, 0.04)',

  // Default cards
  md: '0 4px 24px rgba(0, 0, 0, 0.08)',

  // Elevated/hovered
  lg: '0 12px 40px rgba(0, 0, 0, 0.12)',

  // Modals/overlays
  xl: '0 20px 50px rgba(0, 0, 0, 0.15)',

  // Inset highlight
  insetHighlight: 'inset 0 1px 1px rgba(255, 255, 255, 0.8)',
  insetHighlightDark: 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
}
```

### Glow Shadows

```typescript
const glowShadows = {
  // Primary glow (green)
  primarySm: '0 0 12px rgba(74, 222, 128, 0.3)',
  primaryMd: '0 4px 12px rgba(74, 222, 128, 0.4)',
  primaryLg: '0 8px 24px rgba(74, 222, 128, 0.5)',

  // Secondary glow (teal)
  secondarySm: '0 0 12px rgba(13, 148, 136, 0.2)',
  secondaryMd: '0 4px 16px rgba(13, 148, 136, 0.3)',

  // Combined glow for prominent elements
  combined: '0 4px 24px rgba(74, 222, 128, 0.08), 0 12px 48px rgba(74, 222, 128, 0.12)',
  combinedHover: '0 12px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(74, 222, 128, 0.2)',
}
```

## Z-Index Scale

```typescript
const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 15,
  overlay: 20,
  modal: 25,
  tooltip: 30,
  toast: 35,
  navigation: 50,
  maximum: 100,
}
```

## Breakpoints

```typescript
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}
```

## Animation Tokens

### Durations

```typescript
const durations = {
  instant: '0ms',
  fast: '100ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
  slowest: '800ms',
}
```

### Timing Functions

```typescript
const easings = {
  // Standard easings
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',

  // Custom cubic-bezier
  easeOutCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
  easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  easeInOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',
  easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',

  // Spring-like
  spring: 'cubic-bezier(0.4, 0, 0.2, 1)',
}
```

## Usage with Tailwind

For projects using Tailwind CSS, extend the theme:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4ADE80',
          50: '#F0FDF4',
          // ... rest of scale
        },
        secondary: {
          DEFAULT: '#0D9488',
          // ... rest of scale
        },
      },
      fontFamily: {
        display: ['Instrument Serif', 'Georgia', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        'card': '24px',
        'button': '14px',
      },
      boxShadow: {
        'glow-primary': '0 4px 12px rgba(74, 222, 128, 0.4)',
        'glow-lg': '0 8px 24px rgba(74, 222, 128, 0.5)',
      },
    },
  },
}
```

## Usage with CSS Variables

```css
:root {
  /* Colors */
  --color-primary: #4ADE80;
  --color-secondary: #0D9488;
  --color-text-primary: #18181B;
  --color-text-secondary: #71717A;
  --color-text-muted: #A3A3A3;
  --color-background: #FFFFFF;
  --color-surface: #F5F5F5;

  /* Typography */
  --font-display: 'Instrument Serif', serif;
  --font-body: 'DM Sans', sans-serif;

  /* Spacing */
  --spacing-unit: 4px;

  /* Border radius */
  --radius-card: 24px;
  --radius-button: 14px;
  --radius-badge: 100px;

  /* Shadows */
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.08);
  --shadow-glow: 0 4px 12px rgba(74, 222, 128, 0.4);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
}
```
