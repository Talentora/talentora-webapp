import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
import { AISummaryApplicant, OverallSummary, TextEvaluation, EmotionEvaluation } from "@/types/analysis";
import { Skeleton } from "@/components/ui/skeleton";

interface AssessmentSummaryProps {
    aiSummary: portalProps['AI_summary'];
}

const Page = ({ aiSummary }: AssessmentSummaryProps) => {
    const typedSummary = aiSummary ? {
        text_eval: aiSummary.text_eval as unknown as TextEvaluation,
        emotion_eval: aiSummary.emotion_eval as unknown as EmotionEvaluation,
        overall_summary: aiSummary.overall_summary as unknown as OverallSummary,
        interview_summary: aiSummary.transcript_summary ? {
            content: aiSummary.transcript_summary
        } : undefined,
        recording_id: aiSummary.recording_id
    } : null;
    const overallSummary = typedSummary?.overall_summary;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Assessment Summary</h2>
            <div className="p-4">
                {!typedSummary || !overallSummary ? (
                    <div>No summary available</div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-gray-700">{overallSummary.explanation}</p>
                    </div>
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