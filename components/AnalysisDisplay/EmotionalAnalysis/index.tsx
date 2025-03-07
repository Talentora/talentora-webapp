import { AISummaryApplicant } from "@/types/analysis";
import TimelineGraph from "./TimelineGraph";
import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface EmotionalAnalysisProps {
    aiSummary: portalProps['AI_summary'] | null;
}

const EmotionalAnalysisSkeleton = () => {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Emotional Analysis</h2>
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Facial Expressions</h3>
                    <Skeleton className="h-[200px] w-full" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Voice Analysis</h3>
                    <Skeleton className="h-[200px] w-full" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">Language Analysis</h3>
                    <Skeleton className="h-[200px] w-full" />
                </div>
            </div>
        </div>
    );
};

const EmotionalAnalysis = ({ aiSummary }: EmotionalAnalysisProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const emotionalAnalysis = aiSummary?.emotion_eval;

    // Create dummy timeline data for demonstration if needed
    const dummyTimelineData = {
        face: Array(100).fill(0).map((_, i) => ({
            time: i * 0.5,
            emotions: {
                joy: Math.random() * 0.5 + 0.2,
                calm: Math.random() * 0.4 + 0.3,
                confusion: Math.random() * 0.3
            }
        })),
        prosody: Array(100).fill(0).map((_, i) => ({
            time: i * 0.5,
            emotions: {
                excitement: Math.random() * 0.4 + 0.1,
                neutral: Math.random() * 0.5 + 0.3,
                uncertainty: Math.random() * 0.3
            }
        })),
        language: Array(100).fill(0).map((_, i) => ({
            time: i * 0.5,
            emotions: {
                positivity: Math.random() * 0.5 + 0.2,
                negativity: Math.random() * 0.3,
                neutrality: Math.random() * 0.4 + 0.4
            }
        }))
    };
    
    return (
        <div className="space-y-4">
            <div 
                className="flex items-center justify-between cursor-pointer" 
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="text-2xl font-semibold">Emotional Analysis</h2>
                {isExpanded ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
            </div>
            
            {isExpanded && (
                <div className={emotionalAnalysis ? 'p-4' : ''}>
                    {!emotionalAnalysis ? (
                        <div>No emotional analysis available</div>
                    ) : (
                        <>
                            <div className="flex flex-row mb-6">
                                <div className="flex-[4]">
                                    <p className="text-gray-700 mb-4">
                                        {typeof emotionalAnalysis === 'object' && emotionalAnalysis !== null && !Array.isArray(emotionalAnalysis) && 'explanation' in emotionalAnalysis ? 
                                            (typeof emotionalAnalysis.explanation === 'string' ? emotionalAnalysis.explanation : "We leverage AI to analyze the applicant's emotional state through facial expressions, voice, and language patterns throughout the interview.") 
                                            : "We leverage AI to analyze the applicant's emotional state through facial expressions, voice, and language patterns throughout the interview."}
                                    </p>
                                </div>
                                
                                <div className="flex-1">
                                    <div className="rounded-lg p-6 shadow-sm">
                                        <div className="text-center">
                                            <div className="flex justify-center">
                                                <div 
                                                    className="w-24 h-24 rounded-full flex items-center justify-center"
                                                        style={{
                                                        background: typeof emotionalAnalysis === 'object' && 
                                                            emotionalAnalysis !== null && 
                                                            'overall_score' in emotionalAnalysis &&
                                                            typeof emotionalAnalysis.overall_score === 'number'
                                                            ? emotionalAnalysis.overall_score < 50 
                                                                ? 'rgb(255, 0, 0)'
                                                                : `hsl(${(emotionalAnalysis.overall_score - 50) * 2.4}, 100%, 45%)`
                                                            : 'rgb(128, 128, 128)',
                                                        boxShadow: '0 0 20px rgba(0,0,0,0.1)'
                                                    }}
                                                >
                                                    <div className="text-3xl font-bold text-white">
                                                        {typeof emotionalAnalysis === 'object' && 
                                                         emotionalAnalysis !== null && 
                                                         'overall_score' in emotionalAnalysis &&
                                                         (typeof emotionalAnalysis.overall_score === 'number' || 
                                                          typeof emotionalAnalysis.overall_score === 'string') ? 
                                                         emotionalAnalysis.overall_score : 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold mb-4 text-center border-b pb-2">
                                    Emotional Timeline Analysis
                                </h3>
                                <TimelineGraph timeline={typeof emotionalAnalysis === 'object' && emotionalAnalysis !== null && 'timeline' in emotionalAnalysis ? emotionalAnalysis.timeline : dummyTimelineData} />
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

EmotionalAnalysis.Skeleton = EmotionalAnalysisSkeleton;

export default EmotionalAnalysis;