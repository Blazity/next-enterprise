// SVG icon components — all icons used across the app
// Use className to control color (text-* utilities work with currentColor fills/strokes)

interface IconProps {
  className?: string
  width?: number
  height?: number
  strokeWidth?: number
}

export function PlayIcon({ className, width = 16, height = 16 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

export function PauseIcon({ className, width = 16, height = 16 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  )
}

export function CloseIcon({ className, width = 16, height = 16, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export function SearchIcon({ className, width = 16, height = 16, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

export function SpinnerIcon({ className, width = 16, height = 16, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

export function HomeIcon({ className, width = 20, height = 20 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  )
}

export function MusicNoteIcon({ className, width = 20, height = 20 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  )
}

export function AlbumIcon({ className, width = 20, height = 20 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
    </svg>
  )
}

export function ArtistIcon({ className, width = 20, height = 20 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  )
}

export function EqualizerIcon({ className, width = 14, height = 14 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <rect x="2" y="6" width="3" height="10" rx="1.5" className="animate-eq-bar-1 origin-bottom" />
      <rect x="6.5" y="3" width="3" height="13" rx="1.5" className="animate-eq-bar-2 origin-bottom" />
      <rect x="11" y="5" width="3" height="11" rx="1.5" className="animate-eq-bar-3 origin-bottom" />
    </svg>
  )
}

export function DiscoverLogoIcon({ className, width = 16, height = 16 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 512 512" fill="currentColor" className={className}>
      <path d="M182.179 159.75h30c0-31.002 4.415-66.799-24.143-95.356-8.968-8.968-17.455-16.07-24.942-22.336C143.295 25.488 135.261 18.046 135.261 0h-30v221.406A67.11 67.11 0 0 0 67.761 210c-37.22 0-67.5 30.28-67.5 67.5s30.28 67.5 67.5 67.5c37.448 0 68.135-30.713 67.468-68.75h.032V57.781c9.458 8.262 20.077 16.341 31.562 27.825 19.029 19.031 15.356 44.009 15.356 74.144zM254.739 154.682v233.725a67.104 67.104 0 0 0-37.5-11.406c-37.22 0-67.5 30.28-67.5 67.5s30.28 67.5 67.5 67.5 67.5-30.28 67.5-67.5V238.6c49.72-9.848 147.613-29.233 197-39.014v128.82a67.104 67.104 0 0 0-37.5-11.406c-37.22 0-67.5 30.28-67.5 67.5s30.28 67.5 67.5 67.5 67.5-30.28 67.5-67.5V103.734z" />
    </svg>
  )
}

export function ChevronLeftIcon({ className, width = 20, height = 20, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

export function ChevronRightIcon({ className, width = 20, height = 20, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

export function TrashIcon({ className, width = 20, height = 20, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  )
}

export function PlaylistIcon({ className, width = 20, height = 20 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4 10h12v2H4zm0-4h12v2H4zm0 8h8v2H4zm10 0v6l5-3z" />
    </svg>
  )
}
