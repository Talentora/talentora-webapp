import { AISummaryApplicant } from "@/types/analysis";
import TimelineGraph from "./TimelineGraph";
import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface EmotionalAnalysisProps {
    aiSummary: portalProps['AI_summary'] | null;
}

const Page = ({ aiSummary }: EmotionalAnalysisProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const typedSummary = aiSummary as unknown as AISummaryApplicant;
    const emotionalAnalysis = typedSummary?.emotion_eval;

    return (
        <div>
            <div className="space-y-4">
                <div 
                    className="flex items-center justify-between cursor-pointer" 
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <h2 className="text-2xl font-semibold">Emotional Analysis</h2>
                    {isExpanded ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                </div>
                
                {isExpanded && (
                    <>
                        <p className="mb-6">We leverage the Hume AI expression analysis service to analyze the applicant's emotional state through facial expressions, voice, and language.</p>
                        
                        <TimelineGraph timeline={emotionalAnalysis?.timeline} />
                    </>
                )}
            </div>
        </div>
    )
}

export default Page;