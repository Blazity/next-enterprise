import { Suspense } from "react"

import { Loader2 } from "lucide-react"

import InviteAcceptClient from "./InviteAcceptClient"

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f0a1e] via-[#1a0a2e] to-[#0a1628]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 size={40} className="animate-spin text-purple-400" />
        <p className="text-sm text-white/60">Loading...</p>
      </div>
    </div>
  )
}

export default function InviteAcceptPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <InviteAcceptClient />
    </Suspense>
  )
}
