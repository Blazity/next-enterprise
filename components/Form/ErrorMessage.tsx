/**
 * ErrorMessage Component
 *
 * Displays an error message if a form field has been touched and an error exists.
 */

import React from "react"

const ErrorMessage = ({ touched, error }: { touched: boolean; error?: string }) => {
  if (touched && error) {
    return <p className="text-xs text-red-500" role="alert">{error}</p>
  }
  return null
}

export default ErrorMessage
