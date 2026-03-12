"use client"

import { SignInButton, useAuth, UserButton, useUser } from "@clerk/nextjs"
import { cn } from "lib/cn"
import { AUTH_TEXT } from "lib/translations"

export function AuthButton({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const { isSignedIn } = useAuth()
  const { user } = useUser()

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-2">
        {/* Button first */}
        <UserButton afterSignOutUrl="/" />

        {/* Username second */}
        {!isCollapsed && (
          <span className="text-primary text-sm font-normal truncate">
            {user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress}
          </span>
        )}
      </div>
    )
  }

  return (
    <SignInButton mode="modal">
      <button
        aria-label={AUTH_TEXT.signInLabel}
        className={cn(
          "text-sm font-medium text-bg bg-primary hover:bg-primary/90 border-0 py-2 rounded-full cursor-pointer transition-colors shadow-glow-sm",
          isCollapsed ? "px-2" : "px-4"
        )}
      >
        {isCollapsed ? "Hi" : AUTH_TEXT.signIn}
      </button>
    </SignInButton>
  )
}