import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ProfileLoading() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-32 mt-1" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-48 mt-1" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-36 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-20 w-full" />
          </div>

          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-20 w-full" />
          </div>

          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          </div>

          <div className="pt-4">
            <Skeleton className="h-9 w-32" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 