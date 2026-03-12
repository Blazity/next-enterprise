"use client"

import { CloseIcon } from "components/icons"
import { cn } from "lib/cn"
import { useToastStore } from "store/useToastStore"

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-24 md:bottom-20 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-[100] flex flex-col gap-3 pointer-events-none w-[90%] md:w-auto">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto min-w-[280px] max-w-md p-4 rounded-xl border shadow-2xl flex items-center justify-between gap-4 animate-fade-in-up",
            toast.type === "success" && "bg-[#121212] border-primary/20 text-white",
            toast.type === "error" && "bg-red-500/10 border-red-500/20 text-red-200",
            toast.type === "info" && "bg-surface-elevated border-[#27272a] text-white"
          )}
        >
          <div className="flex items-center gap-3">
            {toast.type === "success" && (
              <div className="size-2 rounded-full bg-primary shadow-glow-sm" />
            )}
            <p className="text-sm font-medium m-0">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 size-6 rounded-lg bg-transparent border-0 flex items-center justify-center text-muted hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <CloseIcon width={14} height={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
