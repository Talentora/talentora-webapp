import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
import VideoTranscript, { VideoTranscriptSkeleton } from "./VideoTranscript";
import NewLexicalAnalysis from "./NewLexicalAnalysis";
import EmotionalAnalysis from "./EmotionalAnalysis";
import AssessmentScores from "./AssessmentScores";
import AssessmentSummary from "./AssessmentSummary";

interface AnalysisDisplayProps {
    portalProps: portalProps;
}

const AnalysisSkeleton = () => {
    return (
        <div className="flex flex-col gap-8">
            {/* Assessment Summary and Scores */}
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                    <AssessmentSummary.Skeleton />
                </div>
                <div className="col-span-1">
                    <AssessmentScores.Skeleton />
                </div>
            </div>

            <VideoTranscriptSkeleton />
            <EmotionalAnalysis.Skeleton />
            <NewLexicalAnalysis.Skeleton />
        </div>
    );
};

const Page = ({ portalProps }: AnalysisDisplayProps) => {
    const { AI_summary } = portalProps;
    
    if (!AI_summary) return <AnalysisSkeleton />;

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                    <AssessmentSummary aiSummary={AI_summary} />
                </div>
                <div className="col-span-1">
                    <AssessmentScores aiSummary={AI_summary} />
                </div>
            </div>
            <VideoTranscript portalProps={portalProps} />
            <EmotionalAnalysis aiSummary={AI_summary} />
            <NewLexicalAnalysis aiSummary={AI_summary} />
        </div>
    );
};

export default Page;