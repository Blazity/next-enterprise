import { useAuth, useClerk } from "@clerk/nextjs"

// Returns a guard function that checks auth before running a callback.
// If not signed in → opens Clerk sign-in modal.
// If signed in → runs the callback immediately.
export function useRequireAuth() {
  const { isSignedIn } = useAuth()
  const { openSignIn } = useClerk()

  function requireAuth(callback: () => void) {
    if (isSignedIn) {
      callback()
    } else {
      openSignIn()
    }
  }

  return { isSignedIn, requireAuth }
}
