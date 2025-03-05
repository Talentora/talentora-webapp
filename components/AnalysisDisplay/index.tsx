import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
import VideoTranscript, { VideoTranscriptSkeleton } from "./VideoTranscript";
import NewLexicalAnalysis from "./NewLexicalAnalysis";
import EmotionalAnalysis from "./EmotionalAnalysis";
import AssessmentSummary from "./AssessmentSummary";
import { Separator } from "@/components/ui/separator";

interface AnalysisDisplayProps {
    portalProps: portalProps;
}

const AnalysisSkeleton = () => {
    return (
        <div className="flex flex-col gap-8">
            {/* Video and Transcript */}
            <VideoTranscriptSkeleton />
            
            {/* Other Analysis Components */}
            <EmotionalAnalysis.Skeleton />
            <NewLexicalAnalysis.Skeleton />
        </div>
    );
};

const Page = ({ portalProps }: AnalysisDisplayProps) => {
    const { AI_summary } = portalProps;
    
    // If no AI summaries are available, show the skeleton loader
    if (!AI_summary) return <AnalysisSkeleton />;
    
    return (
        <div className="space-y-8">
            {/* <h2 className="text-2xl font-semibold">Interview Analysis</h2> */}
            
            {/* Video and Transcript */}
            <VideoTranscript portalProps={portalProps} />
            
            <Separator />
            
            {/* Emotional Analysis */}
            <EmotionalAnalysis aiSummary={AI_summary} />
            
            <Separator />
            
            {/* Lexical Analysis */}
            <NewLexicalAnalysis aiSummary={AI_summary} />
        </div>
    );
};

export default Page;