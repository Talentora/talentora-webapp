"use client";
import { ApplicantData } from "@/components/Reports/data/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useReportsDashboard } from "@/components/Reports/context/ReportsDashboardContext";
import { Send, Clock, CircleCheckBig } from "lucide-react";

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

// New status logic: 
// - If hasSupabaseData === true => "invited"
// - If hasSupabaseData === false/undefined => "not_invited"
// - "invite_completed" is not used in this logic, but kept for UI compatibility
function getApplicantStatus(applicant: ApplicantData): "not_invited" | "invited" | "invite_completed" {
  if (applicant.hasSupabaseData) return "invited";
  return "not_invited";
}

const STATUS_BAR_COLORS: Record<"not_invited" | "invited" | "invite_completed", string> = {
  not_invited: "bg-gray-400",
  invited: "bg-yellow-400",
  invite_completed: "bg-green-500",
};

const STATUS_BAR_LABELS: Record<"not_invited" | "invited" | "invite_completed", string> = {
  not_invited: "Not Invited",
  invited: "Invited",
  invite_completed: "Invite Completed",
};

export const ApplicantTable = ({ data, chartFilter }: ApplicantTableProps) => {
  // Get searchQuery from ReportsDashboardContext
  const { searchQuery } = useReportsDashboard();
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

  // Tab counts using new status logic
  const notInvitedCount = data.filter(a => getApplicantStatus(a) === "not_invited").length;
  const invitedCount = data.filter(a => getApplicantStatus(a) === "invited").length;
  // For compatibility, show 0 for invite_completed
  const inviteCompletedCount = 0;

  // Determine color for the current tab
  const statusBarColor = STATUS_BAR_COLORS[tab];
  const statusBarLabel = STATUS_BAR_LABELS[tab];

  return (
    <div>
      {/* Colored bar at the top of the table based on status mode */}
      <div
        className={`h-2 w-full rounded-t-lg ${statusBarColor} transition-colors`}
        aria-label={statusBarLabel}
        title={statusBarLabel}
      />
      <Tabs value={tab} onValueChange={v => setTab(v as any)} className="w-full">
        <TabsList>
          <TabsTrigger value="not_invited" className="gap-1">
            <Send className="h-4 w-4" />
            <p>Not Invited </p>
            <Badge className="ml-2">{notInvitedCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="invited" className="gap-1">
            <Clock className="h-4 w-4" />
            <p>Invited</p>
            <Badge className="ml-2">{invitedCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="invite_completed" className="gap-1">
            <CircleCheckBig className="h-4 w-4" />
            <p>Invite Completed</p>
            <Badge className="ml-2">{inviteCompletedCount}</Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="not_invited">
          <ApplicantStatusTable
            data={sortedData}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
            status="not_invited"
          />
        </TabsContent>
        <TabsContent value="invited">
          <ApplicantStatusTable
            data={sortedData}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
            status="invited"
          />
        </TabsContent>
        <TabsContent value="invite_completed">
          <ApplicantStatusTable
            data={[]}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
            status="invite_completed"
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
  status,
}: {
  data: ApplicantData[];
  sortField: string;
  sortDirection: "asc" | "desc";
  handleSort: (field: string) => void;
  status?: "not_invited" | "invited" | "invite_completed";
}) {
  return (
    <div className="border rounded-lg">
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