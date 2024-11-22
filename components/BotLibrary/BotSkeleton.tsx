import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export function BotSkeleton() {
  return (
    <Card className="flex flex-row bg-foreground border border-gray-200 rounded-lg p-5 relative">
      <CardHeader className="w-1/3">
        <div className="w-full flex items-center justify-center mb-4 min-h-[100px]">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="w-2/3 flex flex-col gap-4">
        <Skeleton className="h-6 w-3/4 mx-auto" /> {/* Bot name */}
        <Skeleton className="h-4 w-1/2 mx-auto" /> {/* Bot role */}
        <div className="space-y-2"> {/* Bot description */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </CardContent>
    </Card>
  );
}

export function BotLibrarySkeleton() {
  return (
    <div className="container mx-auto p-4">
      <Skeleton className="h-10 w-64 mb-6" /> {/* Title */}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-full mb-4 flex flex-row justify-between gap-10">
          <Skeleton className="h-10 w-full" /> {/* Search bar */}
          <Skeleton className="h-10 w-40" /> {/* Create button */}
        </div>
        
        {/* Bot cards */}
        {[...Array(6)].map((_, index) => (
          <BotSkeleton key={index} />
        ))}
      </div>
    </div>
  );
} 