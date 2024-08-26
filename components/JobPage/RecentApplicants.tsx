import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface RecentApplicantsProps {
  toggleSection: (section: string) => void;
  visible: boolean;
  jobId: number;
}

interface ApplicantRowProps {
  name: string;
  date: string;
  experience: string;
  status: string;
}

import { Tables } from "@/types/types_db";
type Applicant = Tables<'applicants'>;
import { getApplicants } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';

export async function RecentApplicants({ toggleSection, visible,jobId }: RecentApplicantsProps) {

  const supabase = createClient();
  const applicants = await getApplicants(supabase,jobId);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Recent Applicants</CardTitle>
          <Button variant="outline" size="sm" onClick={() => toggleSection('recentApplicants')}>
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
                <TableHead>Applied Date</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.map((applicant: Applicant) => (
                <ApplicantRow key={applicant.id} name={applicant.first_name + ' ' + applicant.last_name} date={''} experience={'applicant.experience'} status={'applicant.status'} />
              ))}

            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
}



function ApplicantRow({ name, date, experience, status }: ApplicantRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>{date}</TableCell>
      <TableCell>{experience}</TableCell>
      <TableCell>
        <span className={`inline-flex items-center rounded-full bg-${getStatusColor(status)}-100 px-2.5 py-0.5 text-xs font-medium text-${getStatusColor(status)}-800`}>
          {status}
        </span>
      </TableCell>
    </TableRow>
  );
}

function getStatusColor(status: any) {
  switch (status) {
    case "Interviewing":
      return "green";
    case "Under Review":
      return "yellow";
    case "Rejected":
      return "red";
    case "Offer Extended":
      return "blue";
    default:
      return "gray";
  }
}
