import { ColumnDef } from "@tanstack/react-table";
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, X, Trash2 } from 'lucide-react';
import { ResumeScoreBadge } from './ApplicantTableColumns';
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
  if (!applicant.ai_summary && !applicant.applicant) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
        </span>
        Not Invited
      </div>
    );
  }

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
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors">
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        Review Ready
      </div>
    );
  }
};

interface GetNotInvitedColumnsProps {
  handleViewApplicant?: (applicant: any) => void;
  setSelectedApplicants: React.Dispatch<React.SetStateAction<any[]>>;
}

export const getNotInvitedColumns = ({ 
  handleViewApplicant,
  setSelectedApplicants
}: GetNotInvitedColumnsProps): ColumnDef<any>[] => [
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
    size: 200,
  },
  {
    accessorKey: "appliedFor",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
      >
        Applied Job
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.job?.name || "No job specified",
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.job?.name || '';
      const b = rowB.original.job?.name || '';
      return a.localeCompare(b);
    },
    size: 200,
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
    size: 250,
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
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Button 
            variant="link" 
            onClick={() => handleViewApplicant && handleViewApplicant(row.original)}
            className="p-0 h-auto font-normal underline"
          >
            View Details
          </Button>
        </div>
      );
    },
    enableSorting: false,
    size: 120,
  },
  {
    id: "reject",
    header: "Reject",
    cell: ({ row }) => {
      return (
        <Button 
          variant="ghost" 
          size="sm"
          className="p-2 h-8 text-red-600 hover:text-red-800 hover:bg-red-50"
          onClick={() => {
            // Empty for now, will implement reject functionality later
            console.log("Reject applicant:", row.original);
          }}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          <span className="text-xs">Reject</span>
        </Button>
      );
    },
    enableSorting: false,
    size: 100,
  }
];
