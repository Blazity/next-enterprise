import React from "react"

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
    <div>
      <h4>{label}</h4>
      <span className={statusColor}>{statusLabel}</span>
    </div>
  )
}

export default StatusField
