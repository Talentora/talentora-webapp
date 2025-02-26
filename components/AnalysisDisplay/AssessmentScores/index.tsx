import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AssessmentScoresProps {
    portalProps: portalProps;
}

const Page = ({ portalProps }: AssessmentScoresProps) => {
    const { AI_summary } = portalProps;
    
    if (!AI_summary) return <Skeleton className="h-[300px]" />;
    
    // Handle both array and object formats for backward compatibility
    const isArray = Array.isArray(AI_summary);
    
    // Extract scores safely with fallbacks
    const overallSummary = isArray 
        ? AI_summary[0]?.overall_summary 
        : AI_summary.overall_summary;
        
    // Get scores with fallbacks
    const overallScore = overallSummary?.score || null;

    return (
        <Card className="border-none">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Assessment Scores</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col items-center">
                        <Badge color={overallScore >= 80 ? "green" : overallScore >= 60 ? "yellow" : "red"}>
                            {overallScore}%
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Add Skeleton component for loading state
Page.Skeleton = function AssessmentScoresSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Assessment Scores</CardTitle>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[200px] w-full" />
            </CardContent>
        </Card>
    );
};

export default Page;