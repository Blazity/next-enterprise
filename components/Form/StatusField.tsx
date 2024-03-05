import React from "react"
import Separator from "./Separator"

const StatusField = ({
  label,
  statusLabel,
  statusColor,
}: {
  label: string
  statusLabel: string
  statusColor: string
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-4">
        <Separator/>
        <h4 className="font-bold text-sm leading-tight text-indigo-900">{label}</h4>
      </div>
      <span className={`text-sm leading-tight ${statusColor}`}>{statusLabel}</span>
    </div>
  )
}

export default StatusField
