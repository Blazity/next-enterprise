"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SignUp } from "@clerk/nextjs"

import { DashboardShell } from "components/DashboardShell/DashboardShell"

export default function SignUpPage() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const handleNavClick = (view: string) => router.push(`/?view=${view}`)

  return (
    <DashboardShell
      activeView="home"
      onNavClick={handleNavClick}
      query={query}
      onQueryChange={setQuery}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-10 animate-fade-in">
        <div className="mb-10 space-y-2">
          <h1 className="text-3xl font-bold text-white">Join Sonara</h1>
          <p className="text-muted">Create a free account to start managing your playlists.</p>
        </div>
        <SignUp
          routing="path"
          path="/sign-up"
          afterSignUpUrl="/accept-share"
          afterSignInUrl="/accept-share"
        />
      </div>
    </DashboardShell>
  )
}
