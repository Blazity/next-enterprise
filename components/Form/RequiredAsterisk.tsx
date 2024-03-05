import React from "react"

const RequiredAsterisk = ({ required }: { required?: boolean }) => {
  return required ? <span className="text-red-500	text-xs"> *</span> : null
}

export default RequiredAsterisk
