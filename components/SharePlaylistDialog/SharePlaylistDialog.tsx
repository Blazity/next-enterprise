"use client"

import { useCallback, useState } from "react"

import { Share2, X } from "lucide-react"
import { useTranslation } from "react-i18next"

import { usePlaylistStore } from "@/store/playlistStore"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface SharePlaylistDialogProps {
  playlistId: number
  sharedByClerkId: string
}

export function SharePlaylistDialog({ playlistId, sharedByClerkId }: SharePlaylistDialogProps) {
  const { t } = useTranslation()
  const { inviteToPlaylist } = usePlaylistStore()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleShare = useCallback(async () => {
    const trimmed = email.trim()
    if (!trimmed) return
    if (!EMAIL_REGEX.test(trimmed)) {
      setErrorMsg(t("share.invalidEmail"))
      setStatus("error")
      return
    }
    setStatus("loading")
    setErrorMsg("")
    try {
      await inviteToPlaylist(playlistId, trimmed, sharedByClerkId)
      setStatus("success")
      setEmail("")
      setTimeout(() => {
        setStatus("idle")
        setOpen(false)
      }, 2000)
    } catch (err) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : t("share.error"))
    }
  }, [email, playlistId, sharedByClerkId, inviteToPlaylist, t])

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
        aria-label={t("share.button")}
      >
        <Share2 size={16} />
        {t("share.button")}
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">{t("share.title")}</h3>
        <button
          onClick={() => {
            setOpen(false)
            setStatus("idle")
            setErrorMsg("")
          }}
          className="rounded-lg p-1 text-white/40 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      <input
        type="email"
        placeholder={t("share.emailPlaceholder")}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          if (status === "error") {
            setErrorMsg("")
            setStatus("idle")
          }
        }}
        onKeyDown={(e) => e.key === "Enter" && handleShare()}
        autoFocus
        className="mb-3 w-full rounded-lg border border-white/[0.1] bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/20"
      />

      {status === "error" && <p className="mb-3 text-xs text-red-400">{errorMsg}</p>}
      {status === "success" && (
        <p className="mb-3 text-xs text-green-400">
          Invitation sent! They&apos;ll receive an email shortly.
        </p>
      )}

      <button
        onClick={handleShare}
        disabled={!email.trim() || status === "loading"}
        className="bg-accent hover:bg-accent-hover rounded-lg px-5 py-2 text-sm font-medium text-white transition-colors disabled:opacity-40"
      >
        {status === "loading" ? t("share.sharing") : t("share.button")}
      </button>
    </div>
  )
}
