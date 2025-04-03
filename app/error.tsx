"use client" // Error boundaries must be Client Components

import { AlertCircle } from "lucide-react"
import { useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorProps {
  title: string
  description: string
}

function ErrorAlert(errorProps: ErrorProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{errorProps.title}</AlertTitle>
      <AlertDescription>{errorProps.description}</AlertDescription>
    </Alert>
  )
}

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 p-4">
      <ErrorAlert title="Something went wrong!" description={error.message || "An unexpected error occurred."} />

      <button
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  )
}
