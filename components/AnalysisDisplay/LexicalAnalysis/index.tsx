import { AISummaryApplicant } from "@/types/analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { portalProps } from "@/app/(pages)/(restricted)/applicants/[id]/page";
interface LexicalAnalysisProps {
    aiSummary: portalProps['AI_summary'] | null;
}

const Page = ({ aiSummary }: LexicalAnalysisProps) => {
    const typedSummary = aiSummary as unknown as AISummaryApplicant;
    const textEval = typedSummary?.text_eval;
    return (
        <div className="border border-gray-300">
            <Card>
                <CardHeader>
                    <CardTitle>Lexical Analysis</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <p>Boiler plate text goes here</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default Page;