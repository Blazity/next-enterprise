"use client"

import { motion } from "framer-motion"

const floatingNotes = [
  { emoji: "🎵", x: "8%", y: "18%", delay: 0, duration: 6, size: "text-5xl" },
  { emoji: "🎶", x: "82%", y: "12%", delay: 1.5, duration: 7, size: "text-6xl" },
  { emoji: "🎧", x: "72%", y: "72%", delay: 0.8, duration: 5.5, size: "text-5xl" },
  { emoji: "🎵", x: "18%", y: "78%", delay: 2, duration: 6.5, size: "text-6xl" },
  { emoji: "🎶", x: "48%", y: "6%", delay: 3, duration: 7.5, size: "text-5xl" },
  { emoji: "🎧", x: "88%", y: "45%", delay: 1, duration: 6, size: "text-4xl" },
  { emoji: "🎵", x: "3%", y: "50%", delay: 2.5, duration: 5, size: "text-6xl" },
  { emoji: "🎶", x: "38%", y: "88%", delay: 0.5, duration: 7, size: "text-5xl" },
  { emoji: "🎤", x: "60%", y: "5%", delay: 1.8, duration: 6.5, size: "text-4xl" },
  { emoji: "🎸", x: "92%", y: "30%", delay: 0.3, duration: 8, size: "text-5xl" },
  { emoji: "🥁", x: "15%", y: "40%", delay: 3.5, duration: 7, size: "text-4xl" },
  { emoji: "🎹", x: "65%", y: "90%", delay: 2.2, duration: 6, size: "text-5xl" },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a1628]" />

      {/* Animated gradient orbs — fixed overlay to prevent layout shift */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute top-[-20%] left-[-10%] h-[700px] w-[700px] rounded-full bg-[#fc3c44]/30 blur-[150px]"
          animate={{ x: [0, 80, 0], y: [0, 60, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-10%] bottom-[-20%] h-[700px] w-[700px] rounded-full bg-[#6366f1]/30 blur-[150px]"
          animate={{ x: [0, -70, 0], y: [0, -50, 0], scale: [1.3, 1, 1.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[20%] right-[15%] h-[500px] w-[500px] rounded-full bg-[#f472b6]/25 blur-[130px]"
          animate={{ x: [0, -60, 0], y: [0, 70, 0], scale: [1, 1.4, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[10%] left-[20%] h-[400px] w-[400px] rounded-full bg-[#a855f7]/20 blur-[120px]"
          animate={{ x: [0, 50, 0], y: [0, -40, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Music note decorations */}
      {floatingNotes.map((note, i) => (
        <span
          key={i}
          className={`pointer-events-none absolute opacity-20 ${note.size}`}
          style={{ left: note.x, top: note.y }}
        >
          {note.emoji}
        </span>
      ))}

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#fc3c44] to-[#f472b6] shadow-lg shadow-[#fc3c44]/25">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
              <circle cx="12" cy="12" r="3" fill="white" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">Streamify</span>
        </div>

        {/* Clerk component renders here */}
        {children}
      </motion.div>
    </div>
  )
}
