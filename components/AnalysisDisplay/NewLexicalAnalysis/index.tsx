import { AI_summary_applicant } from "@/app/(pages)/applicants/[id]/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TextEvaluation {
    explanation: string;
    overall_score: number;
}

interface AssessmentSummaryProps {
    summary: (AI_summary_applicant & { text_eval?: TextEvaluation }) | null;
}

const Page = ({ summary }: AssessmentSummaryProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Assessment Summary </CardTitle>
            </CardHeader>
            <CardContent className={summary?.text_eval ? 'p-4' : ''}>
                {!summary?.text_eval ? (
                    <div>No summary available</div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-gray-700">{summary.text_eval.explanation}</p>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Overall Score:</span>
                            <span>{summary.text_eval.overall_score}/100</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default Page;