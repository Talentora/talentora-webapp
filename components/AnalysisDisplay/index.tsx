import { AI_summary_applicant } from "@/app/(pages)/applicants/[id]/page";
import VideoTranscript from "./VideoTranscript";
import NewLexicalAnalysis from "./NewLexicalAnalysis";
import EmotionalAnalysis from "./EmotionalAnalysis";
import LexicalAnalysis from "./LexicalAnalysis";
import AssessmentScores from "./AssessmentScores";
import AssessmentSummary from "./AssessmentSummary";
interface AnalysisDisplayProps {
    aiSummary: AI_summary_applicant | null;
}

const Page = ({ aiSummary }: AnalysisDisplayProps) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <AssessmentSummary summary={aiSummary} />
                <AssessmentScores scores={aiSummary} />
            </div>
            <EmotionalAnalysis analysis={aiSummary} />
            <NewLexicalAnalysis summary={aiSummary} />
            <LexicalAnalysis analysis={aiSummary} />
            <VideoTranscript aiSummary={aiSummary} />

        </div>
    )
}

export default Page;