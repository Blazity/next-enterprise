import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>

      {/* Skeleton cards - repeat for multiple items */}
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <Card key={index} className="mx-auto max-w-3xl">
            <CardHeader className="gap-2">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter>
              <div className="flex w-full justify-between">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </CardFooter>
          </Card>
        ))}
    </div>
  )
}
