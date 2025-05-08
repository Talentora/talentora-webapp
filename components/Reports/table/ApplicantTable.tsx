"use client";
import { ApplicantData } from "@/components/Reports/data/fake-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { useState, useMemo } from "react";
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

// Status logic
function getApplicantStatus(applicant: ApplicantData): "not_invited" | "invited" | "invite_completed" {
  if (applicant.AI_Summary && applicant.application) {
    return "invite_completed"
  }
  else if (applicant.application) {
    return "invited"
  }
  else {
    return "not_invited"
  }
}

const STATUS_BAR_COLORS: Record<"not_invited" | "invited" | "invite_completed", string> = {
  not_invited: "bg-gray-400",
  invited: "bg-yellow-400",
  invite_completed: "bg-green-500",
};

const STATUS_BAR_LABELS: Record<"not_invited" | "invited" | "invite_completed", string> = {
  not_invited: "Not Invited",
  invited: "Invited",
  invite_completed: "Interview Completed",
};

export const ApplicantTable = ({ data, chartFilter }: ApplicantTableProps) => {
  const { searchQuery } = useReportsDashboard();
  const [sortField, setSortField] = useState<string>("application.created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [tab, setTab] = useState<"not_invited" | "invited" | "invite_completed">("not_invited");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>( {} );
  const [filteringColumn, setFilteringColumn] = useState<string | null>(null);

  // Helper to get unique values for a column
  const getUniqueColumnValues = (key: string) => {
    return Array.from(new Set(data.map(applicant => getNestedValue(applicant, key)).filter(Boolean)));
  };

  // Filter by tab status
  const tabFilteredData = data.filter(applicant => getApplicantStatus(applicant) === tab);

  // Filter data based on chart selection, search query, and column filters
  const filteredData = tabFilteredData.filter(applicant => {
    // Chart filter
    if (chartFilter && chartFilter.field && chartFilter.value) {
      const fieldValue = getNestedValue(applicant, chartFilter.field);
      if (String(fieldValue || '') !== String(chartFilter.value)) {
        return false;
      }
    }
    // Search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const firstName = applicant.candidate?.first_name?.toLowerCase() || '';
      const lastName = applicant.candidate?.last_name?.toLowerCase() || '';
      const jobName = applicant.job?.name?.toLowerCase() || '';
      const stage = applicant.interviewStages?.name?.toLowerCase() || '';
      if (
        !(
          firstName.includes(lowerQuery) ||
          lastName.includes(lowerQuery) ||
          jobName.includes(lowerQuery) ||
          stage.includes(lowerQuery)
        )
      ) {
        return false;
      }
    }
    // Column filters
    for (const [key, value] of Object.entries(columnFilters)) {
      if (value && String(getNestedValue(applicant, key)) !== value) {
        return false;
      }
    }
    return true;
  });

  // Sort the filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = getNestedValue(a, sortField);
    const bValue = getNestedValue(b, sortField);
    // Numeric sort for AI_Summary scores
    if (sortField.startsWith("AI_Summary")) {
      const aNum = typeof aValue === 'number' ? aValue : parseFloat(aValue) || 0;
      const bNum = typeof bValue === 'number' ? bValue : parseFloat(bValue) || 0;
      return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
    }
    // Handle date sorting
    if (sortField === 'application.created_at') {
      const aDate = aValue ? new Date(aValue).getTime() : 0;
      const bDate = bValue ? new Date(bValue).getTime() : 0;
      return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
    }
    // Default string comparison
    if (sortDirection === 'asc') {
      return String(aValue || '').localeCompare(String(bValue || ''));
    } else {
      return String(bValue || '').localeCompare(String(aValue || ''));
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
  const inviteCompletedCount = data.filter(a => getApplicantStatus(a) === "invite_completed").length;

  // Determine color for the current tab
  const statusBarColor = STATUS_BAR_COLORS[tab];
  const statusBarLabel = STATUS_BAR_LABELS[tab];

  return (
    <div className="w-[600px]">
      {/* Colored bar at the top of the table based on status mode */}
      <div
        className={`h-2 w-full rounded-t-lg ${statusBarColor} transition-colors`}
        aria-label={statusBarLabel}
        title={statusBarLabel}
      />
      <Tabs value={tab} onValueChange={v => setTab(v as any)} className="w-full">
        <TabsList className="flex justify-between">
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
            <p>Completed</p>
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
            data={sortedData}
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
  // Define columns for each tab
  let columns: {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (applicant: ApplicantData) => React.ReactNode;
  }[] = [
    {
      key: "candidate.first_name",
      label: "Name",
      sortable: true,
      render: (applicant) => (
        <>
          {applicant.candidate?.first_name} {applicant.candidate?.last_name}
        </>
      ),
    },
    {
      key: "job.name",
      label: "Job",
      sortable: true,
      render: (applicant) => applicant.job?.name || "Unknown",
    },
    {
      key: "interviewStages.name",
      label: "Stage",
      sortable: true,
      render: (applicant) => applicant.interviewStages?.name || "Unknown",
    },
    {
      key: "job.status",
      label: "Status",
      sortable: true,
      render: (applicant) => (
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${applicant.job?.status === 'OPEN' ? 'bg-green-500' : 'bg-gray-500'}`} />
          {applicant.job?.status || 'Unknown'}
        </div>
      ),
    },
  ];

  if (status === "invited" || status === "invite_completed") {
    columns.push({
      key: "application.created_at",
      label: "Invited",
      sortable: true,
      render: (applicant) =>
        applicant.application?.created_at
          ? formatDistanceToNow(new Date(applicant.application.created_at), { addSuffix: true })
          : "Unknown",
    });
  }

  if (status === "invite_completed") {
    columns = [
      ...columns,
      {
        key: "AI_Summary.text_eval.technical.overall_score",
        label: "Tech Score",
        sortable: true,
        render: (applicant) =>
          applicant.AI_Summary?.text_eval?.technical?.overall_score ?? "N/A",
      },
      {
        key: "AI_Summary.text_eval.behavioral.overall_score",
        label: "Behavioral Score",
        sortable: true,
        render: (applicant) =>
          applicant.AI_Summary?.text_eval?.behavioral?.overall_score ?? "N/A",
      },
      {
        key: "AI_Summary.text_eval.experience.overall_score",
        label: "Experience Score",
        sortable: true,
        render: (applicant) =>
          applicant.AI_Summary?.text_eval?.experience?.overall_score ?? "N/A",
      },
      {
        key: "AI_Summary.text_eval.communication.overall_score",
        label: "Communication Score",
        sortable: true,
        render: (applicant) =>
          applicant.AI_Summary?.text_eval?.communication?.overall_score ?? "N/A",
      },
      {
        key: "AI_Summary.emotion_eval.overall_score",
        label: "Emotion Score",
        sortable: true,
        render: (applicant) =>
          applicant.AI_Summary?.emotion_eval?.overall_score ?? "N/A",
      },
      {
        key: "AI_Summary.resume_analysis.resumeScore",
        label: "Resume Score",
        sortable: true,
        render: (applicant) =>
          applicant.AI_Summary?.resume_analysis?.resumeScore ?? "N/A",
      },
      {
        key: "AI_Summary.resume_analysis.technicalScore",
        label: "Resume Tech",
        sortable: true,
        render: (applicant) =>
          applicant.AI_Summary?.resume_analysis?.technicalScore ?? "N/A",
      },
      {
        key: "AI_Summary.resume_analysis.cultureFitScore",
        label: "Culture Fit",
        sortable: true,
        render: (applicant) =>
          applicant.AI_Summary?.resume_analysis?.cultureFitScore ?? "N/A",
      },
      {
        key: "AI_Summary.resume_analysis.communicationScore",
        label: "Resume Comm",
        sortable: true,
        render: (applicant) =>
          applicant.AI_Summary?.resume_analysis?.communicationScore ?? "N/A",
      },
    ];
  }

  return (
    <div className="border rounded-lg overflow-x-auto w-full">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                className={col.sortable ? "cursor-pointer" : ""}
              >
                {col.label}
                {col.sortable && sortField === col.key && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((applicant, index) => (
              <TableRow key={applicant.application?.id || index}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render
                      ? col.render(applicant)
                      : getNestedValue(applicant, col.key) ?? "N/A"}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4 text-muted-foreground">
                No applicants found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}