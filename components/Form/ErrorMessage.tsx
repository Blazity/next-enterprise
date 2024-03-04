import React from "react"

const ErrorMessage = ({ touched, error }: { touched: boolean; error?: string }) => {
  if (touched && error) {
    return <p className="mt-1">{error}</p>
  }
  return null
}

export default ErrorMessage
