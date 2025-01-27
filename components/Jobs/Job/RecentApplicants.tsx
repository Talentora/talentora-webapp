import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ApplicantTable from '@/components/Applicants/ApplicantTable';
import { Button } from '@/components/ui/button';
import ApplicationsGraph from './ApplicantStatistics/ApplicationsGraph';
import { ApplicantCandidate } from '@/types/merge';
interface RecentApplicantsProps {
  applicants: ApplicantCandidate[];
}

export function RecentApplicants({ applicants }: RecentApplicantsProps) {
  const [visible, setVisible] = useState(true);
  console.log("applicants",applicants);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <Card>
      <CardHeader>
        <div className="p-4 flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">
            Recent Applicants
          </CardTitle>
          <Button variant="outline" size="sm" onClick={toggleVisibility}>
            {visible ? 'Hide' : 'Show'} Applicants
          </Button>
        </div>
      </CardHeader>
      {visible && (
        <CardContent>
          <Card className="p-5 border-none shadow-3xl h-full">
            <ApplicationsGraph applicants={applicants} />
            <div className="mt-6">
              <ApplicantTable applicants={applicants} disablePortal={true} />
            </div>
          </Card>
        </CardContent>
      )}
    </Card>
  );
}
