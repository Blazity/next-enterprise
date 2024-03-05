/**
 * StatusField Component
 * 
 * Displays a status label with a customizable color. This component is typically used
 * to indicate the status of a process or entity (e.g., success, error) within the application.
 * Includes a visual separator and supports dynamic text and color customization through props.
 */

import React from "react"
import Separator from "./Separator"

interface StatusFieldProps {
  label: string;
  statusLabel: string;
  statusColor: string;
}

const StatusField: React.FC<StatusFieldProps> = ({ label, statusLabel, statusColor }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-4">
        <Separator/>
        <h4 className="font-bold text-sm leading-tight text-indigo-900">{label}</h4>
      </div>
      {/* Dynamically styled based on status */}
      <span className={`text-sm leading-tight ${statusColor}`}>{statusLabel}</span>
    </div>
  )
}

export default StatusField
