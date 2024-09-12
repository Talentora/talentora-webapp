import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tables } from '@/types/types_db';

type Applicant = Tables<'applicants'>;

interface RecentApplicantsProps {
  applicants: Applicant[];
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
          <Button
            variant="outline"
            size="sm"
            onClick={toggleVisibility}
          >
            {visible ? 'Hide' : 'Show'} Applicants
          </Button>
        </div>
      </CardHeader>
      {visible && (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.map((applicant: Applicant) => (
                <ApplicantRow
                  key={applicant.id}
                  name={`${applicant.first_name} ${applicant.last_name}`}
                  status={applicant.status || ''}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
}

interface ApplicantRowProps {
  name: string;
  status: string;
}

function ApplicantRow({ name, status }: ApplicantRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center rounded-full bg-${getStatusColor(status)}-100 px-2.5 py-0.5 text-xs font-medium text-${getStatusColor(status)}-800`}
        >
          {status}
        </span>
      </TableCell>
    </TableRow>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Interviewing':
      return 'green';
    case 'Under Review':
      return 'yellow';
    case 'Rejected':
      return 'red';
    case 'Offer Extended':
      return 'blue';
    default:
      return 'gray';
  }
}
