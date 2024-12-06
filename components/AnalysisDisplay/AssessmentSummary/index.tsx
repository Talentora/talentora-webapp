import { AI_summary_applicant } from "@/app/(pages)/applicants/[id]/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface AssessmentSummaryProps {
    summary: AI_summary_applicant
}

const Page = ({ summary }: AssessmentSummaryProps) => {
    return (
        <div className="p-4 border border-gray-300">
            <Card>
        <CardHeader>
            <CardTitle>Assessment Scores</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
            <p>Boiler plate text goes here</p>
        </CardContent>
    </Card>
        </div>
    )
}

export default Page;