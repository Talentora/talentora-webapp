import { ApplicantData } from "@/components/Reports/data/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ApplicantTableProps {
  data: ApplicantData[];
  chartFilter?: {
    field: string;
    value: string;
  } | null;
}

// Helper to get nested value by dot notation
const getNestedValue = (obj: any, path: string): any => {
  if (!path) return undefined;
  const keys = path.split('.');
  return keys.reduce((o, key) => {
    if (o && typeof o === 'object') {
      if (key.includes('[') && key.includes(']')) {
        const arrayKey = key.substring(0, key.indexOf('['));
        const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')));
        return o[arrayKey] && Array.isArray(o[arrayKey]) ? o[arrayKey][index] : undefined;
      }
      return o[key];
    }
    return undefined;
  }, obj);
};

function getApplicantStatus(applicant: ApplicantData): "not_invited" | "invited" | "invite_completed" {
  // Not invited: no application row
  // Invited: has application row, but no AI summary
  // Invite completed: has application row and AI summary
  const hasApplication = !!applicant.application;
  const hasAISummary = !!applicant.application?.ai_summary;
  if (!hasApplication) return "not_invited";
  if (hasApplication && !hasAISummary) return "invited";
  if (hasApplication && hasAISummary) return "invite_completed";
  return "not_invited";
}

export const ApplicantTable = ({ data, chartFilter }: ApplicantTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("application.created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [tab, setTab] = useState<"not_invited" | "invited" | "invite_completed">("not_invited");

  // Filter by tab status
  const tabFilteredData = data.filter(applicant => getApplicantStatus(applicant) === tab);

  // Filter data based on chart selection and search query
  const filteredData = tabFilteredData.filter(applicant => {
    // Apply chart filter if present
    if (chartFilter && chartFilter.field && chartFilter.value) {
      const fieldValue = getNestedValue(applicant, chartFilter.field);
      if (String(fieldValue || '') !== String(chartFilter.value)) {
        return false;
      }
    }
    // Apply search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const firstName = applicant.candidate?.first_name?.toLowerCase() || '';
      const lastName = applicant.candidate?.last_name?.toLowerCase() || '';
      const jobName = applicant.job?.name?.toLowerCase() || '';
      const stage = applicant.interviewStages?.name?.toLowerCase() || '';
      return firstName.includes(lowerQuery) ||
        lastName.includes(lowerQuery) ||
        jobName.includes(lowerQuery) ||
        stage.includes(lowerQuery);
    }
    return true;
  });

  // Sort the filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = getNestedValue(a, sortField) || '';
    const bValue = getNestedValue(b, sortField) || '';
    // Handle date sorting
    if (sortField === 'application.created_at') {
      const aDate = aValue ? new Date(aValue).getTime() : 0;
      const bDate = bValue ? new Date(bValue).getTime() : 0;
      return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
    }
    // Default string comparison
    if (sortDirection === 'asc') {
      return String(aValue).localeCompare(String(bValue));
    } else {
      return String(bValue).localeCompare(String(aValue));
    }
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Tab counts
  const notInvitedCount = data.filter(a => getApplicantStatus(a) === "not_invited").length;
  const invitedCount = data.filter(a => getApplicantStatus(a) === "invited").length;
  const inviteCompletedCount = data.filter(a => getApplicantStatus(a) === "invite_completed").length;

  return (
    <div className="mt-8 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Applicants
          {chartFilter && (
            <Badge variant="outline" className="ml-2 font-normal">
              Filtered by: {chartFilter.field.split('.').pop()} = {chartFilter.value}
            </Badge>
          )}
          <Badge className="ml-2">
            {sortedData.length} {sortedData.length === 1 ? 'result' : 'results'}
          </Badge>
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applicants..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={v => setTab(v as any)} className="w-full">
        <TabsList>
          <TabsTrigger value="not_invited">
            Not Invited <Badge className="ml-2" >{notInvitedCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="invited">
            Invited <Badge className="ml-2">{invitedCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="invite_completed">
            Invite Completed <Badge className="ml-2" >{inviteCompletedCount}</Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="not_invited">
          <ApplicantStatusTable
            data={sortedData}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
          />
        </TabsContent>
        <TabsContent value="invited">
          <ApplicantStatusTable
            data={sortedData}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
          />
        </TabsContent>
        <TabsContent value="invite_completed">
          <ApplicantStatusTable
            data={sortedData}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Table component for each tab
function ApplicantStatusTable({
  data,
  sortField,
  sortDirection,
  handleSort,
}: {
  data: ApplicantData[];
  sortField: string;
  sortDirection: "asc" | "desc";
  handleSort: (field: string) => void;
}) {
  return (
    <div className="border rounded-md mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('candidate.first_name')} className="cursor-pointer">
              Name {sortField === 'candidate.first_name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead onClick={() => handleSort('job.name')} className="cursor-pointer">
              Job {sortField === 'job.name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead onClick={() => handleSort('interviewStages.name')} className="cursor-pointer">
              Stage {sortField === 'interviewStages.name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead onClick={() => handleSort('job.status')} className="cursor-pointer">
              Status {sortField === 'job.status' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead onClick={() => handleSort('application.created_at')} className="cursor-pointer">
              Applied {sortField === 'application.created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((applicant, index) => (
              <TableRow key={applicant.application?.id || index}>
                <TableCell className="font-medium">
                  {applicant.candidate?.first_name} {applicant.candidate?.last_name}
                </TableCell>
                <TableCell>{applicant.job?.name || 'Unknown'}</TableCell>
                <TableCell>{applicant.interviewStages?.name || 'Unknown'}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${applicant.job?.status === 'OPEN' ? 'bg-green-500' : 'bg-gray-500'}`} />
                    {applicant.job?.status || 'Unknown'}
                  </div>
                </TableCell>
                <TableCell>
                  {applicant.application?.created_at
                    ? formatDistanceToNow(new Date(applicant.application.created_at), { addSuffix: true })
                    : 'Unknown'
                  }
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                No applicants found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}