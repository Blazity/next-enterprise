import React from "react"

const RequiredAsterisk = ({ required }: { required?: boolean }) => {
  return required ? <span className="text-sm"> *</span> : null
}

export default RequiredAsterisk
