import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

const LoadingSkeleton = () => (
    <div className="min-h-screen">
    
  
      <main className="container px-4">
        <div className="grid gap-6 md:grid-cols-2 px-10">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border bg-background p-5 border-border shadow-sm relative">
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-48 mb-4" />
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )

export default LoadingSkeleton;