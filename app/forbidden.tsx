"use client"

import { AlertCircle, ArrowLeft, ShieldX } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Forbidden() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="border-destructive/50 max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldX className="text-destructive h-6 w-6" />
            <CardTitle className="text-2xl">Access Forbidden</CardTitle>
          </div>
          <CardDescription>You don't have permission to access this resource</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error 403</AlertTitle>
            <AlertDescription>
              You lack the necessary permissions to view this page. If you believe this is an error, please contact your
              administrator.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
