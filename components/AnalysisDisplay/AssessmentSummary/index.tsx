import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AssessmentSummaryProps {
    portalProps: portalProps;
}

const Page = ({ portalProps }: AssessmentSummaryProps) => {
    const { AI_summary } = portalProps;
    
    if (!AI_summary) return <Skeleton className="h-[300px]" />;
    
    // Handle both array and object formats for backward compatibility
    const isArray = Array.isArray(AI_summary);
    
    // Extract data safely with fallbacks
    const explanation = isArray 
        ? AI_summary[0]?.overall_summary?.explanation 
        : AI_summary.overall_summary?.explanation;

    
    return (
        <Card className="p-4 border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg font-semibold">Assessment Summary</CardTitle>
            </CardHeader>
            <CardContent >
                <div className="text-base">
                    {explanation ? (
                        <p className="whitespace-pre-line">{explanation}</p>
                    ) : (
                        <p className="text-muted-foreground">No summary available</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

// Add Skeleton component for loading state
Page.Skeleton = function AssessmentSummarySkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Assessment Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[200px] w-full" />
            </CardContent>
        </Card>
    );
};

export default Page;