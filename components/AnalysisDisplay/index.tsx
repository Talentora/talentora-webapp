import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
import VideoTranscript, { VideoTranscriptSkeleton } from "./VideoTranscript";
import NewLexicalAnalysis from "./NewLexicalAnalysis";
import EmotionalAnalysis from "./EmotionalAnalysis";
import AssessmentScores from "./AssessmentScores";
import AssessmentSummary from "./AssessmentSummary";
import ResumeAnalysisScores from "./ResumeAnalysisScores";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

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
    const [activeTab, setActiveTab] = useState<string>(
        AI_summary ? AI_summary.id : ""
    );
    
    // If no AI summaries are available, show the skeleton loader
    if (!AI_summary) return <AnalysisSkeleton />;
    
    // Always use tabs, even for a single summary
    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <h1 className="text-2xl font-bold">Analysis</h1>
                <TabsList className="mb-4">
                    {Array.isArray(AI_summary) ? (
                        AI_summary.map((summary) => (
                            <TabsTrigger key={summary.id} value={summary.id}>
                                {summary.created_at 
                                    ? format(new Date(summary.created_at), "MMM d, yyyy")
                                    : "Unknown Date"}
                            </TabsTrigger>
                        ))
                    ) : (
                        <TabsTrigger key={AI_summary.id} value={AI_summary.id}>
                            {AI_summary.created_at 
                                ? format(new Date(AI_summary.created_at), "MMM d, yyyy")
                                : "Unknown Date"}
                        </TabsTrigger>
                    )}
                </TabsList>
                
                {Array.isArray(AI_summary) ? (
                    AI_summary.map((summary) => (
                        <TabsContent key={summary.id} value={summary.id}>
                            <div className="flex flex-row gap-6">
                                <div className="flex-4">
                                    <AssessmentSummary portalProps={{...portalProps, AI_summary: summary}} />
                                </div>
                                <div className="flex-2">
                                    <AssessmentScores portalProps={{...portalProps, AI_summary: summary}} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 mt-6">
                                {/* Add Resume Analysis Scores in its own row */}
                                <div className="grid grid-cols-1 gap-6 mt-6">
                                    <ResumeAnalysisScores portalProps={{...portalProps, AI_summary: summary}} />
                                </div>
                                <div className="grid grid-cols-1 gap-6 mt-6">
                                    <VideoTranscript portalProps={{...portalProps, AI_summary: summary}} />
                                    <EmotionalAnalysis aiSummary={summary} />
                                    <NewLexicalAnalysis aiSummary={summary} />
                                </div>
                            </div>
                        </TabsContent>
                    ))
                ) : (
                    <TabsContent key={AI_summary.id} value={AI_summary.id}>
                        <div className="flex flex-row gap-6">
                            <div className="flex-4">
                                <AssessmentSummary portalProps={{...portalProps, AI_summary: AI_summary}} />
                            </div>
                            <div className="flex-2">
                                <AssessmentScores portalProps={{...portalProps, AI_summary: AI_summary}} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 mt-6">
                            {/* Add Resume Analysis Scores in its own row */}
                            <div className="grid grid-cols-1 gap-6 mt-6">
                                <ResumeAnalysisScores portalProps={{...portalProps, AI_summary: AI_summary}} />
                            </div>
                            <div className="grid grid-cols-1 gap-6 mt-6">
                                <VideoTranscript portalProps={{...portalProps, AI_summary: AI_summary}} />
                                <EmotionalAnalysis aiSummary={AI_summary} />
                                <NewLexicalAnalysis aiSummary={AI_summary} />
                            </div>
                        </div>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
};

export default Page;