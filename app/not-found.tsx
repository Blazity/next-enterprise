"use client"
import { ArrowLeft, FileQuestion, Home } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileQuestion className="text-muted-foreground h-6 w-6" />
            <CardTitle className="text-2xl">Page Not Found</CardTitle>
          </div>
          <CardDescription>We couldn't find the page you were looking for</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>The page you requested doesn't exist or may have been moved.</p>
          <div className="border-muted-foreground/20 mt-4 border-l-4 pl-4 text-sm italic">Error 404</div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
