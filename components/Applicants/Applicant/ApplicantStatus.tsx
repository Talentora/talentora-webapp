import { ApplicantCandidate } from '@/types/merge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ApplicantCandidateStatusProps {
  ApplicantCandidate: ApplicantCandidate;
}

export default function ApplicantCandidateStatus({
  ApplicantCandidate
}: ApplicantCandidateStatusProps) {
  const progress = 75; // This should be calculated based on the ApplicantCandidate status

  return (
    <Card>
      <CardHeader>
        <CardTitle>Applicant Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div> */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Current Stage:</span>
            <span className="text-sm">{ApplicantCandidate.interviewStages.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
