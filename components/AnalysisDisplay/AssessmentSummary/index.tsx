import { portalProps } from "@/app/(pages)/applicants/[id]/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AISummaryApplicant, OverallSummary, TextEvaluation, EmotionEvaluation } from "@/types/analysis";

interface AssessmentSummaryProps {
    aiSummary: portalProps['AI_summary'];
}

const Page = ({ aiSummary }: AssessmentSummaryProps) => {
    const typedSummary = aiSummary ? {
        text_eval: aiSummary.text_eval as unknown as TextEvaluation,
        emotion_eval: aiSummary.emotion_eval as unknown as EmotionEvaluation,
        overall_summary: aiSummary.overall_summary as unknown as OverallSummary,
        interview_summary: aiSummary.transcript_summary ? {
            content: aiSummary.transcript_summary
        } : undefined,
        recording_id: aiSummary.recording_id
    } : null;
    const overallSummary = typedSummary?.overall_summary;

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Assessment Summary</CardTitle>
                </CardHeader>
                <CardContent className={!typedSummary || !overallSummary ? "" : "p-4"}>
                    {!typedSummary || !overallSummary ? (
                        <div>No summary available</div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-gray-700">{overallSummary.explanation}</p>
                         
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default Page;