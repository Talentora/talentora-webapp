import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
import { AISummaryApplicant, OverallSummary, TextEvaluation, EmotionEvaluation } from "@/types/analysis";
import { Skeleton } from "@/components/ui/skeleton";

interface AssessmentSummaryProps {
    aiSummary: portalProps['AI_summary'];
}

const Page = ({ aiSummary }: AssessmentSummaryProps) => {
    // Type guard to check if overall_summary exists and has explanation property
    const hasExplanation = (summary: any): summary is { overall_summary: { explanation: string } } => {
        return summary?.overall_summary && typeof summary.overall_summary.explanation === 'string';
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Assessment Summary</h2>
            <div className="p-4">
                {!aiSummary ? (
                    <div>No summary available</div>
                ) : hasExplanation(aiSummary) ? (
                    <div className="space-y-4">
                        <p className="text-gray-700">{aiSummary.overall_summary.explanation}</p>
                    </div>
                ) : (
                    <div>Invalid summary format</div>
                )}
            </div>
        </div>
    )
}

const AssessmentSummarySkeleton = () => {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Assessment Summary</h2>
            <Skeleton className="h-[200px] w-full" />
        </div>
    );
};

Page.Skeleton = AssessmentSummarySkeleton;

export default Page;