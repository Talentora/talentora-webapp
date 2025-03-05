import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AssessmentSummaryProps {
    portalProps: portalProps;
}

const Page = ({ portalProps }: AssessmentSummaryProps) => {
    const { AI_summary } = portalProps;
    
    if (!AI_summary) return <AssessmentSummarySkeleton />;
    
    // Extract the overall summary explanation
    let explanation = "";
    
    try {
        // Try to parse the overall_summary if it's a string
        if (typeof AI_summary.overall_summary === 'string') {
            try {
                const parsed = JSON.parse(AI_summary.overall_summary);
                explanation = parsed.explanation || "";
            } catch (e) {
                console.error("Error parsing overall_summary JSON:", e);
                explanation = AI_summary.overall_summary || "";
            }
        } else if (AI_summary.overall_summary && typeof AI_summary.overall_summary === 'object') {
            // If it's already an object, access directly
            explanation = (AI_summary.overall_summary as any).explanation || "";
        }
    } catch (e) {
        console.error("Error extracting explanation:", e);
        explanation = "Unable to load summary data.";
    }
    
    return (
        <Card className="p-4 border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">Assessment Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
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
function AssessmentSummarySkeleton() {
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

Page.Skeleton = AssessmentSummarySkeleton;

export default Page;