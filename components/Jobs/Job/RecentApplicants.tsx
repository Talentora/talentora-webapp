import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ApplicantTable from '@/components/Applicants/ApplicantTable';
import { Button } from '@/components/ui/button';


import { Application } from '@/types/greenhouse';
interface RecentApplicantsProps {
  applicants: Application[];
}

export function RecentApplicants({ applicants }: RecentApplicantsProps) {
  const [visible, setVisible] = useState(true);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
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
          <ApplicantTable applicants={applicants} onSelectApplicant={null} rowLimit={5} />
        </CardContent>
      )}
    </Card>
  );
}
