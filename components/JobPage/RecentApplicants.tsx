import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface RecentApplicantsProps {
  toggleSection: (section: string) => void;
  visible: boolean;
}

interface ApplicantRowProps {
  name: string;
  date: string;
  experience: string;
  status: string;
}

export function RecentApplicants({ toggleSection, visible }: RecentApplicantsProps) {
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
              <ApplicantRow name="Sarah Johnson" date="2023-06-01" experience="6 years" status="Interviewing" />
              <ApplicantRow name="Michael Chen" date="2023-05-30" experience="4 years" status="Under Review" />
              <ApplicantRow name="Emily Rodriguez" date="2023-05-28" experience="7 years" status="Interviewing" />
              <ApplicantRow name="David Kim" date="2023-05-25" experience="3 years" status="Rejected" />
              <ApplicantRow name="Lisa Patel" date="2023-05-22" experience="5 years" status="Offer Extended" />
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
