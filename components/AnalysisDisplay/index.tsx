import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
import VideoTranscript from "./VideoTranscript";
import NewLexicalAnalysis from "./NewLexicalAnalysis";
import EmotionalAnalysis from "./EmotionalAnalysis";
import LexicalAnalysis from "./LexicalAnalysis";
import AssessmentScores from "./AssessmentScores";
import AssessmentSummary from "./AssessmentSummary";
import { Skeleton } from "@/components/ui/skeleton";
import ResumeViewer from "./ResumeViewer";
interface AnalysisDisplayProps {
    portalProps: portalProps;
}

const AnalysisSkeleton = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                    <Skeleton className="h-[200px] w-full" />
                </div>
                <div className="col-span-1">
                    <Skeleton className="h-[200px] w-full" />
                </div>
            </div>
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[600px] w-full" />
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
            <ResumeViewer portalProps={portalProps} />
            <EmotionalAnalysis aiSummary={AI_summary} />
            <NewLexicalAnalysis aiSummary={AI_summary} />
        </div>
    );
};

export default Page;