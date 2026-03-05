"use client"

// AuthButton — shows Sign in button or Clerk UserButton based on auth state

import { SignInButton, UserButton, useAuth } from "@clerk/nextjs"

import { AUTH_TEXT } from "lib/translations"

export function AuthButton() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <UserButton afterSignOutUrl="/" />
  }

  return (
    <SignInButton mode="modal">
      <button
        aria-label={AUTH_TEXT.signInLabel}
        className="text-sm font-medium text-black bg-primary hover:bg-primary/90 border-0 px-4 py-2 rounded-full cursor-pointer transition-colors shadow-glow-sm"
      >
        {AUTH_TEXT.signIn}
      </button>
    </SignInButton>
  )
}
