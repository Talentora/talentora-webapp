import { ColumnDef } from "@tanstack/react-table";
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

// Add this helper function for resume scores
const getResumeAnalysisScore = (applicant: any, scoreType: string): number | null => {
  if (!applicant.ai_summary) return null;
  
  if (Array.isArray(applicant.ai_summary) && applicant.ai_summary.length > 0) {
    const sortedSummaries = [...applicant.ai_summary].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    const latestSummary = sortedSummaries[0];
    return latestSummary?.resume_analysis?.[scoreType] || 
           latestSummary?.overall_summary?.[scoreType] || 
           null;
  }
  
  return applicant.ai_summary.resume_analysis?.[scoreType] || 
         applicant.ai_summary.overall_summary?.[scoreType] || 
         applicant.ai_summary[scoreType] || 
         null;
};

// Add this component for status badges
const ApplicationStatusBadge = ({ applicant }: { applicant: any }) => {
  if (!applicant.ai_summary && applicant.application?.supabase_application_id) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        In Progress
      </div>
    );
  } else {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
        </span>
        Status Unknown
      </div>
    );
  }
};

interface GetInProgressColumnsProps {
  handleViewApplicant: (applicant: any) => void;
  setSelectedApplicants: React.Dispatch<React.SetStateAction<any[]>>;
}

export const getInProgressColumns = ({ 
  handleViewApplicant,
  setSelectedApplicants
}: GetInProgressColumnsProps): ColumnDef<any>[] => [
  {
    id: "select",
    header: ({ table }: any) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }: any) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const { candidate } = row.original;
      return candidate ? 
        `${candidate.first_name} ${candidate.last_name}` : 
        "Unknown Candidate";
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.candidate?.first_name || '';
      const b = rowB.original.candidate?.first_name || '';
      return a.localeCompare(b);
    },
    size: 150,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.candidate?.email_addresses?.[0]?.value || "No email address",
    enableSorting: true,
    size: 200,
    sortingFn: (rowA, rowB) => {
      const emailA = rowA.original.candidate?.email_addresses?.[0]?.value?.toLowerCase() || '';
      const emailB = rowB.original.candidate?.email_addresses?.[0]?.value?.toLowerCase() || '';
      return emailA.localeCompare(emailB);
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <ApplicationStatusBadge applicant={row.original} />,
    enableSorting: true,
    size: 160,
  },
  {
    accessorKey: "resumeScore",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
      >
        Resume Score
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const score = getResumeAnalysisScore(row.original, 'resumeScore');
      return (
        <div className="flex justify-center">
          {score === null ? (
            <span className="text-gray-500">N/A</span>
          ) : (
            <Badge variant={score >= 80 ? "success" : score >= 60 ? "warning" : "destructive"}>
              {score}
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: true,
    size: 120,
  },
  {
    accessorKey: "invitedDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
      >
        Invited Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const invitationDate = row.original.application?.created_at;
      if (!invitationDate) return "Not invited";
      
      return new Date(invitationDate).toLocaleDateString();
    },
    enableSorting: true,
    size: 120,
    sortingFn: (rowA, rowB) => {
      const dateA = rowA.original.application?.created_at ? new Date(rowA.original.application.created_at).getTime() : 0;
      const dateB = rowB.original.application?.created_at ? new Date(rowB.original.application.created_at).getTime() : 0;
      return dateA - dateB;
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return (
        <Button 
          variant="link" 
          onClick={() => handleViewApplicant(row.original)}
          className="p-0 h-auto font-normal underline"
        >
          View Details
        </Button>
      );
    },
    enableSorting: false,
    size: 100,
  }
];
