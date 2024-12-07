import { AI_summary_applicant } from "@/app/(pages)/applicants/[id]/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface AssessmentSummaryProps {
    summary: AI_summary_applicant | null;
}

interface OverallSummary {
    explanation: string;
    overall_score: number;
}

interface ExtendedAISummary extends AI_summary_applicant {
    overall_summary?: OverallSummary;
}

const Page = ({ summary }: AssessmentSummaryProps) => {
    const typedSummary = summary as ExtendedAISummary;
    const overallSummary = typedSummary?.overall_summary;
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Assessment Summary</CardTitle>
                </CardHeader>
                <CardContent className={!summary || !overallSummary ? "" : "p-4"}>
                    {!summary || !overallSummary ? (
                        <div>No summary available</div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-gray-700">{overallSummary.explanation}</p>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Overall Score:</span>
                                <span>{overallSummary.overall_score}/100</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default Page;