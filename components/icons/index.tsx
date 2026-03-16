// SVG icon components — all icons used across the app
// Use className to control color (text-* utilities work with currentColor fills/strokes)

import { cn } from "lib/cn"

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

export function MenuIcon({ className, width = 20, height = 20, strokeWidth = 2 }: IconProps) {
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
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

export function DiscoverLogoIcon({ className, width = 16, height = 16 }: IconProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 512 512" 
      fill="currentColor" 
      className={cn("animate-spin-very-slow", className)}
    >
      <g>
        <path d="M480.452 0c-17.396 0-31.548 14.152-31.548 31.548 0 14.812 10.262 27.265 24.048 30.64v173.319c0 21.55-8.392 41.81-23.63 57.048l-1.534 1.534c.053-2.01.083-4.02.083-6.025 0-59.815-23.293-116.051-65.589-158.346-42.295-42.296-98.531-65.589-158.346-65.589S107.885 87.422 65.589 129.718C23.293 172.014 0 228.249 0 288.064S23.293 404.115 65.589 446.41C107.885 488.707 164.12 512 223.936 512c94.758 0 179.63-59.995 211.191-149.291a7.501 7.501 0 0 0-14.143-4.999C391.537 441.024 312.349 497 223.936 497 108.728 497 15 403.272 15 288.064S108.728 79.129 223.936 79.129s208.936 93.728 208.936 208.936c0 7.378-.401 14.807-1.168 22.11l-58.781 58.78-6.032-6.032a7.5 7.5 0 0 0-10.606 0l-28.057 28.057c-7.319 7.32-8.779 18.295-4.422 27.093l-8.98 8.98a7.5 7.5 0 0 0 5.303 12.803 7.474 7.474 0 0 0 5.303-2.197l8.961-8.961a23.417 23.417 0 0 0 10.473 2.453c6.29 0 12.2-2.45 16.639-6.894l28.057-28.056a7.497 7.497 0 0 0 0-10.606l-6.032-6.032 76.399-76.399c18.071-18.071 28.023-42.098 28.023-67.654V62.189C501.738 58.813 512 46.36 512 31.548 512 14.152 497.848 0 480.452 0zM350.895 413.653c-1.608 1.61-3.75 2.497-6.029 2.497s-4.42-.887-6.032-2.5c-3.326-3.326-3.326-8.738 0-12.064l22.753-22.753 12.064 12.064-22.756 22.756zM480.452 48.097c-9.125 0-16.548-7.423-16.548-16.548S471.327 15 480.452 15 497 22.423 497 31.548s-7.423 16.549-16.548 16.549z" />
        <path d="M223.936 192.387c-52.757 0-95.677 42.92-95.677 95.677 0 52.757 42.92 95.677 95.677 95.677 52.757 0 95.677-42.92 95.677-95.677 0-52.757-42.92-95.677-95.677-95.677zm0 176.355c-44.485 0-80.677-36.192-80.677-80.677s36.192-80.677 80.677-80.677c44.485 0 80.677 36.192 80.677 80.677s-36.192 80.677-80.677 80.677z" />
        <path d="M223.936 264.532c-12.976 0-23.532 10.557-23.532 23.532s10.557 23.532 23.532 23.532 23.532-10.557 23.532-23.532-10.557-23.532-23.532-23.532zm0 32.065c-4.705 0-8.532-3.828-8.532-8.532 0-4.704 3.828-8.532 8.532-8.532 4.704 0 8.532 3.828 8.532 8.532 0 4.704-3.828 8.532-8.532 8.532zM328.718 214.981c-14.676-21.005-35.021-36.961-58.837-46.144a7.5 7.5 0 1 0-5.397 13.995c21.019 8.105 38.979 22.192 51.938 40.74 13.251 18.965 20.255 41.266 20.255 64.493a7.5 7.5 0 0 0 15 0c0-26.315-7.939-51.587-22.959-73.084zM240.958 161.448a129.24 129.24 0 0 0-17.021-1.125 7.5 7.5 0 0 0-.001 15c5.033 0 10.093.334 15.04.993a7.502 7.502 0 0 0 1.982-14.868zM183.374 393.291c-21.016-8.106-38.972-22.194-51.929-40.74-13.248-18.964-20.251-41.263-20.251-64.487a7.5 7.5 0 0 0-15 0c0 26.312 7.938 51.582 22.955 73.078 14.672 21.003 35.014 36.959 58.826 46.145a7.49 7.49 0 0 0 2.698.504 7.5 7.5 0 0 0 2.701-14.5zM223.936 400.807c-5.03 0-10.092-.334-15.046-.995a7.497 7.497 0 0 0-8.425 6.444 7.5 7.5 0 0 0 6.444 8.425 129.421 129.421 0 0 0 17.027 1.125 7.5 7.5 0 0 0 0-14.999z" />
        <path d="M223.936 128.258a7.5 7.5 0 0 0 0 15c79.846 0 144.806 64.96 144.806 144.806a7.5 7.5 0 0 0 15 0c0-88.117-71.689-159.806-159.806-159.806zM223.936 432.871c-79.847 0-144.807-64.96-144.807-144.807a7.5 7.5 0 0 0-15 0c0 88.118 71.689 159.807 159.807 159.807a7.5 7.5 0 0 0 0-15zM415.092 271.391c-.355-4.127-3.985-7.189-8.116-6.829a7.5 7.5 0 0 0-6.829 8.116c.438 5.083.66 10.26.66 15.387a7.5 7.5 0 0 0 15 0c0-5.555-.241-11.165-.715-16.674z" />
        <path d="M409.21 238.009C386.704 154.51 310.516 96.193 223.936 96.193a7.5 7.5 0 0 0 0 15c79.814 0 150.046 53.753 170.791 130.719a7.503 7.503 0 0 0 7.237 5.55 7.5 7.5 0 0 0 7.246-9.453zM47.724 303.451a179.97 179.97 0 0 1-.66-15.387 7.5 7.5 0 0 0-15 0c0 5.555.241 11.165.715 16.674a7.5 7.5 0 0 0 14.945-1.287zM223.936 464.936c-79.799 0-150.028-53.741-170.783-130.688a7.5 7.5 0 1 0-14.482 3.906c22.516 83.479 98.7 141.782 185.265 141.782a7.5 7.5 0 0 0 0-15z" />
      </g>
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

export function CopyIcon({ className, width = 20, height = 20, strokeWidth = 2 }: IconProps) {
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
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}
export function UserIcon({ className, width = 20, height = 20 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  )
}
export function UsersIcon({ className, width = 20, height = 20 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  )
}
export function LinkIcon({ className, width = 20, height = 20, strokeWidth = 2 }: IconProps) {
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
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}
export function SunIcon({ className, width = 20, height = 20, strokeWidth = 2 }: IconProps) {
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
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

export function MoonIcon({ className, width = 20, height = 20, strokeWidth = 2 }: IconProps) {
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
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export function SkipBackIcon({ className, width = 20, height = 20, strokeWidth = 2 }: IconProps) {
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
      <polygon points="19 20 9 12 19 4 19 20" />
      <line x1="5" y1="19" x2="5" y2="5" />
    </svg>
  )
}

export function SkipForwardIcon({ className, width = 20, height = 20, strokeWidth = 2 }: IconProps) {
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
      <polygon points="5 4 15 12 5 20 5 4" />
      <line x1="19" y1="5" x2="19" y2="19" />
    </svg>
  )
}

export function ShuffleIcon({ className, width = 20, height = 20, strokeWidth = 2 }: IconProps) {
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
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  )
}

export function RepeatIcon({ className, width = 20, height = 20, strokeWidth = 2 }: IconProps) {
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
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  )
}

export function VolumeIcon({ className, width = 20, height = 20, strokeWidth = 2 }: IconProps) {
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
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
}

export function ChevronUpIcon({ className, width = 20, height = 20, strokeWidth = 2 }: IconProps) {
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
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

export function ChevronDownIcon({ className, width = 20, height = 20, strokeWidth = 2 }: IconProps) {
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
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function MaximizeIcon({ className, width = 20, height = 20, strokeWidth = 2 }: IconProps) {
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
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  )
}

export function PlusIcon({ className, width = 20, height = 20, strokeWidth = 2 }: IconProps) {
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
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
export function HeartIcon({ className, width = 20, height = 20, strokeWidth = 2 }: IconProps) {
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
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

export function HeartFilledIcon({ className, width = 20, height = 20 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

export function DotsHorizontalIcon({ className, width = 20, height = 20 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  )
}

export function QueueIcon({ className, width = 20, height = 20 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4 6h16v2H4zm4 5h12v2H8zm4 5h8v2h-8z" />
    </svg>
  )
}


export function SparklesIcon({ className, width = 20, height = 20 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zm6 10l.75 2.25L21 15l-2.25.75L18 18l-.75-2.25L15 15l2.25-.75L18 12zm-10 6l.5 1.5L10 21l-1.5.5L8 20l-.5-1.5L6 18l1.5-.5L8 16l.5 1.5L10 18l-1.5.5z"/>
    </svg>
  )
}
