import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
import { AISummaryApplicant } from "@/types/analysis";
interface AssessmentScoresProps {
    aiSummary: portalProps['AI_summary'] | null;
}

interface OverallSummary {
    score: number;
    summary: string;
}

const Page = ({ aiSummary }: AssessmentScoresProps) => {
    const typedSummary = aiSummary as unknown as AISummaryApplicant;
    const overallSummary = typedSummary?.overall_summary as unknown as OverallSummary;
    const overallScore = overallSummary?.score;


    return (
        <div>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Overall Score</CardTitle>
                </CardHeader>
                <CardContent className="p-8 flex justify-center items-center">
                    <div 
                        className="w-32 h-32 rounded-full flex items-center justify-center"
                        style={{
                            background: overallScore < 50 
                                ? 'rgb(255, 0, 0)' // Red for scores below 50
                                : `hsl(${(overallScore - 50) * 2.4}, 100%, 45%)`, // Gradient from red (0) through yellow (60) to green (120)
                            boxShadow: '0 0 20px rgba(0,0,0,0.1)'
                        }}
                    >
                        <div className="text-5xl font-bold text-white">
                            {overallScore}%
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Page;