import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function JobHeaderSkeleton() {
  return (
    <Card className="rounded-lg hover:bg-accent/50 transition-colors p-4 dark:bg-transparent border border-border">
      <CardHeader className="mb-4 relative">
        <Skeleton className="h-8 w-1/2" />
        <div className="flex flex-col gap-4 mb-4">
          <div className="pt-4 flex items-center space-x-4 text-sm">
            <span className="flex items-center">
              <Skeleton className="h-6 w-24 rounded-full" />
            </span>
            <span className="flex items-center">
              <Skeleton className="h-6 w-32" />
            </span>
            <span className="flex items-center">
              <Skeleton className="h-6 w-20 rounded-full" />
            </span>
            <span className="flex items-center space-x-2 text-sm flex-col">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="border-t border-input space-y-6">
        <section>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-5 w-5" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-24 w-full" />
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

export function RecentApplicantsSkeleton() {
  return (
    <div className="pt-3 space-y-5">
      <Card className="bg-background text-foreground">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-9 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function JobConfigSkeleton() {
  return (
    <Card className="rounded-lg hover:bg-accent/50 transition-colors dark:bg-transparent border border-border">
      <CardContent className="space-y-6">
        <div className="mb-6 p-4 border rounded-lg">
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-9 w-40" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BotConfigSkeleton() {
  return (
    <Card className="bg-background text-foreground">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </CardContent>
    </Card>
  );
}
