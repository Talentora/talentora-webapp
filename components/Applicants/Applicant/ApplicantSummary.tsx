import { ApplicantCandidate } from '@/types/greenhouse';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ApplicantSummaryProps {
  ApplicantCandidate: ApplicantCandidate;
}

export default function ApplicantSummary({
  ApplicantCandidate
}: ApplicantSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-500">
          {'No summary available for this candidate.'}
        </p>
      </CardContent>
    </Card>
  );
}
