import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ParsedOverallSummary } from "@/types/analysis";

interface AssessmentScoreProps {
    portalProps: portalProps;
}

const AssessmentScore = ({ portalProps }: AssessmentScoreProps) => {
    const { AI_summary } = portalProps;
    
    if (!AI_summary) return <AssessmentScoreSkeleton />;
    
    // Extract scores
    let overallScore = 0;
    let textScore = 0;
    let emotionScore = 0;
    
    try {
        // Parse overall score from JSON string if needed
        if (typeof AI_summary.overall_summary === 'string') {
            try {
                const parsed = JSON.parse(AI_summary.overall_summary);
                overallScore = parsed.score || 0;
            } catch (e) {
                console.error("Error parsing overall_summary JSON:", e);
                overallScore = 0;
            }
        } else if (AI_summary.overall_summary && typeof AI_summary.overall_summary === 'object') {
            overallScore = (AI_summary.overall_summary as any).score || 0;
        }
        
        // Parse text_eval score
        if (typeof AI_summary.text_eval === 'string') {
            try {
                const parsed = JSON.parse(AI_summary.text_eval);
                textScore = parsed.overall_score || 0;
            } catch (e) {
                console.error("Error parsing text_eval JSON:", e);
                textScore = 0;
            }
        } else if (AI_summary.text_eval && typeof AI_summary.text_eval === 'object') {
            textScore = (AI_summary.text_eval as any).overall_score || 0;
        }
        
        // Parse emotion_eval score
        if (typeof AI_summary.emotion_eval === 'string') {
            try {
                const parsed = JSON.parse(AI_summary.emotion_eval);
                emotionScore = parsed.overall_score || 0;
            } catch (e) {
                console.error("Error parsing emotion_eval JSON:", e);
                emotionScore = 0;
            }
        } else if (AI_summary.emotion_eval && typeof AI_summary.emotion_eval === 'object') {
            emotionScore = (AI_summary.emotion_eval as any).overall_score || 0;
        }
        
    } catch (e) {
        console.error("Error extracting scores:", e);
    }

    return (
        <Card className="p-4 border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">Assessment Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="font-medium">Overall Match Score</span>
                        <span className="font-bold text-lg">{overallScore}/100</span>
                    </div>
                    <div className="relative h-2.5 w-full bg-blue-50 rounded-md overflow-hidden">
                        <div
                            className="h-full rounded-md transition-all duration-500 ease-in-out"
                            style={{
                                background: getVibrantColorForScore(overallScore),
                                width: `${overallScore}%`,
                                marginLeft: `${100 - overallScore}%`, // Starts from right side
                            }}
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="font-medium">Emotional Analysis</span>
                        <span>{emotionScore}/100</span>
                    </div>
                    <div className="relative h-2 w-full bg-blue-50 rounded-md overflow-hidden">
                        <div
                            className="h-full rounded-md transition-all duration-500 ease-in-out"
                            style={{
                                background: getVibrantColorForScore(emotionScore),
                                width: `${emotionScore}%`,
                                marginLeft: `${100 - emotionScore}%`, // Starts from right side
                            }}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="font-medium">Lexical Analysis</span>
                        <span>{textScore}/100</span>
                    </div>
                    <div className="relative h-2 w-full bg-blue-50 rounded-md overflow-hidden">
                        <div
                            className="h-full rounded-md transition-all duration-500 ease-in-out"
                            style={{
                                background: getVibrantColorForScore(textScore),
                                width: `${textScore}%`,
                                marginLeft: `${100 - textScore}%`, // Starts from right side
                            }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Helper function to generate color based on score
function getColorForScore(score: number): string {
    if (score < 40) return '#ef4444'; // red
    if (score < 70) return '#f59e0b'; // amber
    return '#22c55e'; // green
}

// New function with more vibrant colors
function getVibrantColorForScore(score: number): string {
    if (score < 40) return 'linear-gradient(90deg, #ff4d4d, #ff0000)'; // vibrant red
    if (score < 70) return 'linear-gradient(90deg, #ffaa33, #ff8800)'; // vibrant orange
    return 'linear-gradient(90deg, #4ade80, #22c55e)'; // vibrant green
}

function AssessmentScoreSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Assessment Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </CardContent>
        </Card>
    );
}

AssessmentScore.Skeleton = AssessmentScoreSkeleton;

export default AssessmentScore;
