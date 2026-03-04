# Component Patterns Reference

Reusable UI component patterns for Wednesday Solutions projects. These patterns establish consistent visual language and interaction behaviors.

## Cards

### Basic Card

```typescript
interface CardProps {
  children: React.ReactNode
  variant?: 'light' | 'dark' | 'glass'
  elevated?: boolean
  interactive?: boolean
}

const cardStyles = {
  light: {
    background: '#FFFFFF',
    border: '1px solid rgba(0, 0, 0, 0.04)',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
  },
  dark: {
    background: 'linear-gradient(135deg, #18181B 0%, #27272A 100%)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
  },
}

// Interactive card with hover effect
function InteractiveCard({ children }: CardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...cardStyles.light,
        borderRadius: '24px',
        padding: '22px',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 12px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(74, 222, 128, 0.2)'
          : cardStyles.light.boxShadow,
        border: isHovered
          ? '1px solid rgba(74, 222, 128, 0.3)'
          : cardStyles.light.border,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  )
}
```

### Card with Glow Effect

For premium/featured content:

```typescript
function GlowCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative' }}>
      {/* Glow layer */}
      <div style={{
        position: 'absolute',
        inset: '-50px',
        background: 'radial-gradient(circle, rgba(74, 222, 128, 0.2) 0%, transparent 70%)',
        filter: 'blur(40px)',
        zIndex: -1,
      }} />

      {/* Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '22px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 12px 48px rgba(74, 222, 128, 0.12)',
        border: '1px solid rgba(74, 222, 128, 0.15)',
      }}>
        {children}
      </div>
    </div>
  )
}
```

### Metrics Card

For displaying data/statistics:

```typescript
interface MetricProps {
  label: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down' | 'neutral'
  color?: string
}

function MetricsCard({ metrics }: { metrics: MetricProps[] }) {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '24px',
      padding: '22px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '18px',
      }}>
        {metrics.map((metric, i) => (
          <div key={i} style={{ textAlign: i === 0 ? 'left' : i === metrics.length - 1 ? 'right' : 'center' }}>
            <p style={{
              fontSize: '9px',
              color: '#71717A',
              marginBottom: '4px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              {metric.label}
            </p>
            <p style={{
              fontSize: '28px',
              fontWeight: '600',
              color: metric.color || '#18181B',
            }}>
              {metric.value}
              {metric.unit && (
                <span style={{ fontSize: '12px', color: '#71717A' }}>{metric.unit}</span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Status indicator */}
      <div style={{
        padding: '10px 12px',
        background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(13, 148, 136, 0.1) 100%)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <div style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: '#4ADE80',
          boxShadow: '0 0 8px rgba(74, 222, 128, 0.5)',
        }} />
        <span style={{ fontSize: '11px', color: '#0D9488', fontWeight: '500' }}>
          Synced with Apple Watch
        </span>
      </div>
    </div>
  )
}
```

### AI Insight Card

Dark card for AI/system messages:

```typescript
function AIInsightCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #18181B 0%, #27272A 100%)',
      borderRadius: '24px',
      padding: '22px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15), 0 12px 48px rgba(13, 148, 136, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '14px',
      }}>
        {/* AI icon */}
        <div style={{
          width: '26px',
          height: '26px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #4ADE80 0%, #0D9488 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(74, 222, 128, 0.3)',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
        </div>
        <span style={{
          fontSize: '10px',
          color: '#71717A',
          letterSpacing: '0.08em',
        }}>
          AI INSIGHT
        </span>
      </div>

      <p style={{
        fontSize: '16px',
        color: '#FFFFFF',
        lineHeight: 1.4,
        marginBottom: '10px',
        fontWeight: '500',
      }}>
        {title}
      </p>
      <p style={{
        fontSize: '13px',
        color: '#A3A3A3',
        lineHeight: 1.5,
      }}>
        {description}
      </p>
    </div>
  )
}
```

## Buttons

### Premium 3D Button

```typescript
function Premium3DButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false) }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        position: 'relative',
        padding: '20px 40px',
        fontSize: '15px',
        fontWeight: '600',
        fontFamily: "'DM Sans', sans-serif",
        color: '#FFFFFF',
        background: isPressed
          ? 'linear-gradient(180deg, #1D8B54 0%, #2AA06A 50%, #34D480 100%)'
          : isHovered
            ? 'linear-gradient(180deg, #3BD975 0%, #2EBE68 50%, #25A85C 100%)'
            : 'linear-gradient(180deg, #4ADE80 0%, #3ACC72 50%, #2AB862 100%)',
        border: 'none',
        borderRadius: '14px',
        cursor: 'pointer',
        overflow: 'hidden',
        transform: isPressed
          ? 'translateY(2px) scale(0.98)'
          : isHovered
            ? 'translateY(-2px)'
            : 'translateY(0)',
        boxShadow: isPressed
          ? 'inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)'
          : isHovered
            ? 'inset 0 1px 1px rgba(255,255,255,0.4), 0 10px 30px -5px rgba(74, 222, 128, 0.5), 0 20px 50px -10px rgba(13, 148, 136, 0.3)'
            : 'inset 0 1px 1px rgba(255,255,255,0.3), 0 4px 12px -2px rgba(74, 222, 128, 0.4), 0 8px 25px -5px rgba(13, 148, 136, 0.2)',
        transition: 'all 0.15s ease',
      }}
    >
      {/* Top highlight */}
      <div style={{
        position: 'absolute',
        top: '1px',
        left: '10%',
        right: '10%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
        opacity: isPressed ? 0 : 1,
      }} />

      {/* Shimmer effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '14px',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '60%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
          animation: 'shimmer 2.5s ease-in-out infinite',
          opacity: isPressed ? 0 : 1,
        }} />
      </div>

      {/* Content */}
      <span style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
      }}>
        {children}
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          style={{
            transform: isHovered && !isPressed ? 'translateX(4px)' : 'translateX(0)',
            transition: 'transform 0.3s ease',
          }}
        >
          <path
            d="M4 9H14M14 9L10 5M14 9L10 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  )
}
```

### Secondary Button

```typescript
function SecondaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button style={{
      fontSize: '14px',
      color: '#18181B',
      fontWeight: '500',
      textDecoration: 'none',
      padding: '10px 20px',
      border: '1px solid #E5E5E5',
      borderRadius: '8px',
      background: 'transparent',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }}>
      {children}
    </button>
  )
}
```

## Badges

### AI-Powered Badge

Premium badge with shimmer effect:

```typescript
function AIPoweredBadge() {
  return (
    <div style={{
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 18px 10px 14px',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FDF9 50%, #F0FDF4 100%)',
      borderRadius: '100px',
      boxShadow: '0 0 0 1px rgba(74, 222, 128, 0.2), 0 4px 8px -2px rgba(74, 222, 128, 0.1), 0 8px 16px -4px rgba(13, 148, 136, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
    }}>
      {/* Top highlight */}
      <div style={{
        position: 'absolute',
        top: '1px',
        left: '20%',
        right: '20%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)',
      }} />

      {/* Shimmer */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '100px', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '50%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(74, 222, 128, 0.15) 50%, transparent 100%)',
          animation: 'shimmer 3s ease-in-out infinite',
        }} />
      </div>

      {/* Pulse dot */}
      <div style={{ position: 'relative', width: '8px', height: '8px' }}>
        <div style={{
          position: 'absolute',
          inset: '-4px',
          borderRadius: '50%',
          background: 'rgba(74, 222, 128, 0.3)',
          filter: 'blur(4px)',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)',
          boxShadow: '0 0 4px rgba(74, 222, 128, 0.6), 0 0 8px rgba(74, 222, 128, 0.4)',
        }} />
      </div>

      {/* Text */}
      <span style={{
        fontSize: '13px',
        fontWeight: '600',
        background: 'linear-gradient(135deg, #0D9488 0%, #059669 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        AI-powered nutrition
      </span>
    </div>
  )
}
```

### Step Number Badge

```typescript
function StepBadge({
  number,
  isActive = false,
}: {
  number: string
  isActive?: boolean
}) {
  return (
    <div style={{
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #4ADE80 0%, #0D9488 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: isActive
        ? '0 8px 20px rgba(74, 222, 128, 0.6)'
        : '0 4px 12px rgba(74, 222, 128, 0.4)',
      transition: 'box-shadow 0.3s ease',
    }}>
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '14px',
        fontWeight: '700',
        color: '#FFFFFF',
      }}>
        {number}
      </span>
    </div>
  )
}
```

## Social Proof

```typescript
function SocialProof() {
  const avatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      {/* Stacked avatars */}
      <div style={{ display: 'flex' }}>
        {avatars.map((src, i) => (
          <div
            key={i}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '2px solid #FFFFFF',
              marginLeft: i > 0 ? '-10px' : 0,
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <img
              src={src}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      {/* Text */}
      <div>
        <p style={{
          fontSize: '14px',
          color: '#18181B',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: '500',
        }}>
          12,000+ professionals
        </p>
        <p style={{
          fontSize: '12px',
          color: '#71717A',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          fueling their performance
        </p>
      </div>
    </div>
  )
}
```

## Navigation

```typescript
function Navigation() {
  const navItems = ['How it Works', 'Menu', 'Pricing']

  return (
    <nav style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      padding: '28px 56px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          background: 'linear-gradient(135deg, #4ADE80 0%, #0D9488 100%)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(74, 222, 128, 0.3)',
        }}>
          <span style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '700' }}>S</span>
        </div>
        <span style={{ fontSize: '18px', fontWeight: '600', color: '#18181B' }}>
          Brand <span style={{ fontWeight: '400', color: '#71717A' }}>Premium</span>
        </span>
      </div>

      {/* Nav Items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '44px' }}>
        {navItems.map((item) => (
          <a
            key={item}
            href="#"
            style={{
              fontSize: '14px',
              color: '#71717A',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
          >
            {item}
          </a>
        ))}
        <a
          href="#"
          style={{
            fontSize: '14px',
            color: '#18181B',
            fontWeight: '500',
            textDecoration: 'none',
            padding: '10px 20px',
            border: '1px solid #E5E5E5',
            borderRadius: '8px',
          }}
        >
          Sign In
        </a>
      </div>
    </nav>
  )
}
```

## Device Mockups

### Phone Frame

```typescript
function PhoneFrame({ children }: { children: React.ReactNode }) {
  const PHONE_WIDTH = 290
  const PHONE_HEIGHT = 600

  return (
    <div style={{
      position: 'relative',
      width: `${PHONE_WIDTH}px`,
      height: `${PHONE_HEIGHT}px`,
    }}>
      {/* Rim lights */}
      <div style={{
        position: 'absolute',
        left: '-8px',
        top: '5%',
        bottom: '5%',
        width: '16px',
        background: 'linear-gradient(180deg, transparent 0%, rgba(74, 222, 128, 0.8) 20%, rgba(74, 222, 128, 1) 50%, rgba(74, 222, 128, 0.8) 80%, transparent 100%)',
        filter: 'blur(8px)',
        borderRadius: '10px',
      }} />
      <div style={{
        position: 'absolute',
        right: '-8px',
        top: '5%',
        bottom: '5%',
        width: '16px',
        background: 'linear-gradient(180deg, transparent 0%, rgba(13, 148, 136, 0.7) 20%, rgba(13, 148, 136, 0.9) 50%, rgba(13, 148, 136, 0.7) 80%, transparent 100%)',
        filter: 'blur(8px)',
        borderRadius: '10px',
      }} />
      <div style={{
        position: 'absolute',
        top: '-6px',
        left: '15%',
        right: '15%',
        height: '12px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.7) 30%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0.7) 70%, transparent 100%)',
        filter: 'blur(4px)',
        borderRadius: '10px',
      }} />

      {/* Phone body */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(165deg, #3A3A3A 0%, #1A1A1A 30%, #0D0D0D 70%, #1A1A1A 100%)',
        borderRadius: '52px',
        padding: '2px',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.1)',
      }}>
        {/* Titanium highlight */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '52px',
          background: 'linear-gradient(165deg, rgba(255,255,255,0.2) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.08) 100%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          width: '100%',
          height: '100%',
          background: '#000000',
          borderRadius: '50px',
          padding: '10px',
        }}>
          {/* Screen */}
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%)',
            borderRadius: '42px',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 0 60px rgba(74, 222, 128, 0.3), 0 0 120px rgba(74, 222, 128, 0.2)',
          }}>
            {/* Dynamic Island */}
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100px',
              height: '32px',
              background: '#000000',
              borderRadius: '20px',
              zIndex: 20,
            }} />

            {/* Screen content */}
            {children}

            {/* Home indicator */}
            <div style={{
              position: 'absolute',
              bottom: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100px',
              height: '4px',
              background: '#18181B',
              borderRadius: '2px',
              opacity: 0.3,
            }} />
          </div>
        </div>
      </div>

      {/* Side buttons */}
      <div style={{
        position: 'absolute',
        left: '-2px',
        top: '120px',
        width: '3px',
        height: '28px',
        background: 'linear-gradient(90deg, #1A1A1A 0%, #2A2A2A 100%)',
        borderRadius: '2px 0 0 2px',
      }} />
    </div>
  )
}
```

## Scroll Progress Indicator

```typescript
function ScrollProgressDots({
  scrollProgress,
  phases,
}: {
  scrollProgress: number
  phases: number[]
}) {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      right: '20px',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      zIndex: 50,
      opacity: scrollProgress > 0.10 && scrollProgress < 0.95 ? 1 : 0,
      transition: 'opacity 0.3s ease',
      pointerEvents: 'none',
    }}>
      {phases.map((threshold, i) => (
        <div
          key={i}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: scrollProgress >= threshold ? '#4ADE80' : 'rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            boxShadow: scrollProgress >= threshold
              ? '0 0 12px rgba(74, 222, 128, 0.6)'
              : 'none',
          }}
        />
      ))}
    </div>
  )
}
```

## Background Patterns

### Dot Pattern

```typescript
function DotPattern({ opacity = 0.5 }: { opacity?: number }) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      opacity,
      backgroundImage: 'radial-gradient(#E5E5E5 1px, transparent 1px)',
      backgroundSize: '32px 32px',
      maskImage: 'linear-gradient(to right, black 0%, transparent 60%)',
      WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 60%)',
    }} />
  )
}
```

### Spotlight/Glow Background

```typescript
function Spotlight({ x = 0, y = 0 }: { x?: number; y?: number }) {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      width: '900px',
      height: '900px',
      pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at center, rgba(74, 222, 128, 0.2) 0%, rgba(74, 222, 128, 0.12) 25%, rgba(13, 148, 136, 0.06) 50%, transparent 70%)',
        animation: 'megaPulse 4s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        right: '10%',
        bottom: '10%',
        background: 'radial-gradient(ellipse at center, rgba(74, 222, 128, 0.25) 0%, rgba(74, 222, 128, 0.15) 30%, transparent 60%)',
        filter: 'blur(30px)',
        animation: 'breathe 3s ease-in-out infinite',
      }} />
    </div>
  )
}
```
