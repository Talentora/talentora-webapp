import { portalProps } from "@/app/(pages)/applicants/[id]/page";
import VideoTranscript from "./VideoTranscript";
import NewLexicalAnalysis from "./NewLexicalAnalysis";
import EmotionalAnalysis from "./EmotionalAnalysis";
import LexicalAnalysis from "./LexicalAnalysis";
import AssessmentScores from "./AssessmentScores";
import AssessmentSummary from "./AssessmentSummary";
interface AnalysisDisplayProps {
    portalProps: portalProps;
}

const Page = ({ portalProps }: AnalysisDisplayProps) => {
    const { AI_summary } = portalProps;
    if (!AI_summary) return null;

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <AssessmentSummary aiSummary={AI_summary} />
                <AssessmentScores aiSummary={AI_summary} />
            </div>
            <EmotionalAnalysis aiSummary={AI_summary} />
            <NewLexicalAnalysis aiSummary={AI_summary} />
            <LexicalAnalysis aiSummary={AI_summary} />
            <VideoTranscript aiSummary={AI_summary} />

        </div>
    )
}

export default Page;