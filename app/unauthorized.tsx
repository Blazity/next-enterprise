import { Lock } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Unauthorized() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Lock className="h-6 w-6 text-amber-500" />
            <CardTitle className="text-2xl">Unauthorized Access</CardTitle>
          </div>
          <CardDescription>Please log in to access this page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-muted-foreground border-b pb-4 text-sm">
            <p>You need to be authenticated to view the requested resource.</p>
            <p className="mt-2 font-semibold">Error 401</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
