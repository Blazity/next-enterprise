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
        <h4>{label}</h4>
      </div>
      <span className={statusColor}>{statusLabel}</span>
    </div>
  )
}

export default StatusField
