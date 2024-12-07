import { AI_summary_applicant } from "@/app/(pages)/applicants/[id]/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface AssessmentSummaryProps {
    summary: AI_summary_applicant | null;
}

const Page = ({ summary }: AssessmentSummaryProps) => {
    if (!summary) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Assessment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>No summary available</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Assessment Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="space-y-4">
                        <p className="text-gray-700">{summary.text_eval.explanation}</p>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Overall Score:</span>
                            <span>{summary.text_eval.overall_score}/100</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Page;