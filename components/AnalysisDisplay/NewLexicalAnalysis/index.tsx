import { AISummaryApplicant } from "@/types/analysis";
import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface AssessmentSummaryProps {
    aiSummary: portalProps['AI_summary'] | null;
}

const LexicalAnalysisSkeleton = () => {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Lexical Analysis</h2>
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                    <Skeleton className="h-[200px] w-full" />
                </div>
                <div>
                    <Skeleton className="h-[200px] w-full" />
                </div>
            </div>
        </div>
    );
};

const NewLexicalAnalysis = ({ aiSummary }: AssessmentSummaryProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const typedSummary = aiSummary as unknown as AISummaryApplicant;
    const textEval = typedSummary?.text_eval;
    
    return (
        <div className="space-y-4">
            <div 
                className="flex items-center justify-between cursor-pointer" 
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="text-2xl font-semibold">Lexical Analysis</h2>
                {isExpanded ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
            </div>
            
            {isExpanded && (
                <div className={textEval ? 'p-4' : ''}>
                    {!textEval ? (
                        <div>No summary available</div>
                    ) : (
                        <div className="flex flex-row">
                            <div className="flex-[4]">
                                <p className="text-gray-700">{textEval.explanation}</p>
                            </div>
                            
                            <div className="flex-1">
                                <div className="rounded-lg  p-6 shadow-sm">
                                    <div className="text-center">
                                        <div className="flex justify-center">
                                            <div 
                                                className="w-24 h-24 rounded-full flex items-center justify-center"
                                                style={{
                                                    background: textEval.overall_score < 50 
                                                        ? 'rgb(255, 0, 0)'
                                                        : `hsl(${(textEval.overall_score - 50) * 2.4}, 100%, 45%)`,
                                                    boxShadow: '0 0 20px rgba(0,0,0,0.1)'
                                                }}
                                            >
                                                <div className="text-3xl font-bold text-white">
                                                    {textEval.overall_score}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

NewLexicalAnalysis.Skeleton = LexicalAnalysisSkeleton;

export default NewLexicalAnalysis;