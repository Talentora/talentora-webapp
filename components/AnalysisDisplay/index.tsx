import { AI_summary_applicant } from "@/app/(pages)/applicants/[id]/page";
import VideoTranscript from "./VideoTranscript";
import AssessmentSummary from "./NewLexicalAnalysis";
import EmotionalAnalysis from "./EmotionalAnalysis";
import LexicalAnalysis from "./LexicalAnalysis";
import AssessmentScores from "./AssessmentScores";
import NewLexicalAnalysis from "./NewLexicalAnalysis";
interface AnalysisDisplayProps {
    aiSummary: AI_summary_applicant | null;
}

const Page = ({ aiSummary }: AnalysisDisplayProps) => {
    return (
        <div className="flex flex-col gap-4">
            <AssessmentScores scores={aiSummary} />
            <AssessmentSummary summary={aiSummary} />
            <EmotionalAnalysis analysis={aiSummary} />
            <NewLexicalAnalysis summary={aiSummary} />
            <LexicalAnalysis analysis={aiSummary} />
            <VideoTranscript aiSummary={aiSummary} />

        </div>
    )
}

export default Page;