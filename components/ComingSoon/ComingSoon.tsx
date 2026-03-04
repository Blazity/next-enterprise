"use client"

import { Construction } from "lucide-react"
import { useTranslation } from "react-i18next"

interface ComingSoonProps {
  titleKey: string
}

export function ComingSoon({ titleKey }: ComingSoonProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <Construction size={48} className="text-text-tertiary" strokeWidth={1.5} />
      <h1 className="text-2xl font-bold text-white">{t(titleKey)}</h1>
      <p className="text-text-secondary max-w-sm text-sm">{t("comingSoon.description")}</p>
    </div>
  )
}
