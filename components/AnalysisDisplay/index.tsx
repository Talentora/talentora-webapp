import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
import VideoTranscript, { VideoTranscriptSkeleton } from "./VideoTranscript";
import NewLexicalAnalysis from "./NewLexicalAnalysis";
import EmotionalAnalysis from "./EmotionalAnalysis";
import AssessmentScores from "./AssessmentScores";
import AssessmentSummary from "./AssessmentSummary";
import ResumeAnalysisScores from "./ResumeAnalysisScores";
import TranscriptDisplay from "./VideoTranscript";

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
        <div className="space-y-6">
            <div >
                <div className="flex flex-row gap-6">
                    <div className="flex-4">
                        <AssessmentSummary portalProps={portalProps} />
                    </div>
                    <div className="flex-2">
                        <AssessmentScores portalProps={portalProps} />
                    </div>
                </div>

                {/* Add Resume Analysis Scores in its own row */}
                <div className="grid grid-cols-1 gap-6">
                    <ResumeAnalysisScores portalProps={portalProps} />
                </div>
                
                <VideoTranscript portalProps={portalProps} />
                <EmotionalAnalysis portalProps={portalProps} />
                <NewLexicalAnalysis portalProps={portalProps} />
            </div>
        </div>
    );
};

export default Page;