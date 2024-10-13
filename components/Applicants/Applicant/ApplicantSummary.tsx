import { Application } from "@/types/greenhouse"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ApplicantSummaryProps {
  application: Application;
}

export default function ApplicantSummary({ application }: ApplicantSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          {application.candidate.summary || "No summary available for this candidate."}
        </p>
      </CardContent>
    </Card>
  )
}