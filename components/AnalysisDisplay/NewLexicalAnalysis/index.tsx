import { AISummaryApplicant } from "@/types/analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
interface AssessmentSummaryProps {
    aiSummary: portalProps['AI_summary'] | null;
}

const Page = ({ aiSummary }: AssessmentSummaryProps) => {
    const typedSummary = aiSummary as unknown as AISummaryApplicant;
    const textEval = typedSummary?.text_eval;
    return (
        <Card>
            <CardHeader>
                <CardTitle>Lexical Analysis</CardTitle>
            </CardHeader>
            <CardContent className={textEval ? 'p-4' : ''}>
                {!textEval ? (
                    <div>No summary available</div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-gray-700">{textEval.explanation}</p>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Overall Score:</span>
                            <span>{textEval.overall_score}/100</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default Page;