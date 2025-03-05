import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ParsedOverallSummary } from "@/types/analysis";
import { PieChart, Pie, Cell, ResponsiveContainer, Label, LabelList } from "recharts";

interface AssessmentScoreProps {
    portalProps: portalProps;
}

const ScoreDonut = ({ score, label }: { score: number; label: string }) => {
    const donutData = [
        { name: "Score", value: score },
        { name: "Remaining", value: 100 - score }
    ];
    
    return (
        <div className="space-y-1">
            <div className="h-20 w-full" >
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 10, bottom: 0, left: 10 }}>
                        <Pie
                            data={donutData}
                            cx="50%"
                            cy="50%"
                            innerRadius={22}
                            outerRadius={30}
                            paddingAngle={2}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                        >
                            <Label 
                                value={`${score}/100`} 
                                position="center"
                                style={{ 
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    fill: '#000'
                                }}
                            />
                            <Cell fill={getVibrantColorForDonut(score)} />
                            <Cell fill="#f1f5f9" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-between">
                <span className="text-xs font-medium">{label}</span>
            </div>
        </div>
    );
};

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
        <Card className="p-3 border rounded-3xl bg-background">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Assessment Scores</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row items-center justify-evenly px-6">
                <ScoreDonut score={overallScore} label="Overall" />
                <ScoreDonut score={emotionScore} label="Emotional" />
                <ScoreDonut score={textScore} label="Lexical" />
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

// Function for donut chart colors
function getVibrantColorForDonut(score: number): string {
    if (score < 40) return '#ff0000'; // vibrant red
    if (score < 70) return '#ff8800'; // vibrant orange
    return '#22c55e'; // vibrant green
}

// Original function with gradients (kept for reference)
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
