import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Tables } from '@/types/types_db';

type Job = Tables<'jobs'>;

interface JobDetailsProps {
  job: Job;
}

export function JobDetails({ job }: JobDetailsProps) {
  const [detailsVisible, setDetailsVisible] = useState(true);

  const toggleDetailsVisibility = () => {
    setDetailsVisible(!detailsVisible);
  };

  return (
    <div >
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold mb-2">Job Description</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleDetailsVisibility}
        >
          {detailsVisible ? 'Hide' : 'Show'} Details
        </Button>
      </div>
      {detailsVisible && (
        <CardContent>
          <p className="text-muted-foreground mb-4">{job.description}</p>
          <h3 className="text-lg font-semibold mb-2">Requirements</h3>
          <ul className="list-disc list-inside text-muted-foreground mb-4">
            <li>Requirement 1</li>
            <li>Requirement 2</li>
            <li>Requirement 3</li>
          </ul>
        </CardContent>
      )}
      
    </div>
  );
}