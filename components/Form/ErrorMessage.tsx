import React from "react"

const ErrorMessage = ({ touched, error }: { touched: boolean; error?: string }) => {
  if (touched && error) {
    return <p className="text-xs">{error}</p>
  }
  return null
}

export default ErrorMessage
