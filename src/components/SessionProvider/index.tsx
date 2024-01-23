"use client"

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react"
import { TUser } from "src/app/types/user"

interface TSessionContext {
  session?: TUser
  setSession: Dispatch<SetStateAction<TUser | undefined>>
}

const SessionContext = createContext<TSessionContext>({
  session: undefined,
  setSession: () => {},
})

export default function SessionProvider({ children, value }: { children: ReactNode; value?: TSessionContext }) {
  const [user, setUser] = useState<TUser | undefined>()
  const contextValue = value || { session: user, setSession: setUser }
  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>
}

export const useSession = () => {
  const context = useContext(SessionContext)

  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }

  return context
}
