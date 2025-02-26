import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AssessmentScoresProps {
    portalProps: portalProps;
}

const ScoreCircle = ({ score }: { score: number | null }) => {
  if (score === null) return <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-400 text-white">N/A</div>;
  
  let backgroundColor = "bg-gray-400"; // Default color
  if (score >= 80) backgroundColor = "bg-green-500"; // Success
  else if (score >= 60) backgroundColor = "bg-yellow-500"; // Warning
  else backgroundColor = "bg-red-500"; // Destructive
  
  return <div className={`w-20 h-20 flex items-center justify-center rounded-full ${backgroundColor} text-white`}>{score}</div>;
};

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
                        <ScoreCircle score={overallScore} />
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