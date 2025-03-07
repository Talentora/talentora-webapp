import { ColumnDef } from "@tanstack/react-table";
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, Check } from 'lucide-react';
import { 
  hasBeenInvited, 
  hasCompletedInterview, 
  getAISummaryScore, 
  ScoreBadge, 
  InterviewStatus 
} from './ApplicantStatusBadges';
import { Badge } from '@/components/ui/badge';

// Helper function to get resume analysis scores
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

// Score badge component for resume scores
export const ResumeScoreBadge = ({ score }: { score: number | null }) => {
  if (score === null) return <span className="text-gray-500">N/A</span>;
  
  let badgeVariant, textColor, bgColor;
  
  if (score >= 80) {
    textColor = "text-white font-semibold";
    bgColor = "bg-green-600";
  } else if (score >= 60) {
    textColor = "text-yellow-900 font-semibold";
    bgColor = "bg-yellow-400";
  } else {
    textColor = "text-white font-semibold";
    bgColor = "bg-red-600";
  }
  
  return (
    <div className={`px-2 py-1 rounded-full text-xs font-medium ${textColor} ${bgColor}`}>
      {score}
    </div>
  );
};

// Add this new component near the top with other components
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

  if (!applicant.ai_summary && applicant.application.supabase_application_id) {
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

interface GetColumnsProps {
  selectedJobId: string;
  handleViewApplicant: (applicant: any) => void;
  setSelectedApplicants: React.Dispatch<React.SetStateAction<any[]>>;
}

export const getApplicantColumns = ({ 
  selectedJobId, 
  handleViewApplicant,
  setSelectedApplicants
}: GetColumnsProps): ColumnDef<any>[] => [
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
  },
  {
    accessorKey: "interviewConducted",
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
    sortingFn: (rowA, rowB) => {
      const getStatusPriority = (row: any) => {
        if (!row.original.ai_summary && !row.original.applicant) return 0;
        if (row.original.ai_summary && row.original.applicant) {
          return hasCompletedInterview(row.original) ? 2 : 1;
        }
        return 0;
      };
      return getStatusPriority(rowA) - getStatusPriority(rowB);
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {

      return row.original.ai_summary ? (
        <Button 
          variant="link" 
          onClick={() => handleViewApplicant(row.original)}
          className="p-0 h-auto font-normal underline"
        >
          View Details
        </Button>
      ) : (
        <span className="text-gray-500">Detail not available</span>
      );
    },
    enableSorting: false,
    size: 100,
  },
  {
    accessorKey: "score",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
      >
        Score
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const applicant = row.original;
      let score = null;
      if (applicant.ai_summary) {
        if (Array.isArray(applicant.ai_summary) && applicant.ai_summary.length > 0) {
          const sortedSummaries = [...applicant.ai_summary].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          score = sortedSummaries[0]?.overall_summary?.score;
        } else {
          // Fix: Access the score directly from overall_summary if it's an object,
          // or try to parse it if it's a string
          if (typeof applicant.ai_summary.overall_summary === 'string') {
            try {
              const parsed = JSON.parse(applicant.ai_summary.overall_summary);
              score = parsed.score;
            } catch (e) {
              console.error("Error parsing overall_summary:", e);
            }
          } else if (applicant.ai_summary.overall_summary) {
            // Access score directly from the overall_summary object
            score = applicant.ai_summary.overall_summary.score;
          }
        }
      }
      
      return (score !== null && !isNaN(parseFloat(score))) ? <ResumeScoreBadge score={parseFloat(score)} /> : <span className="text-gray-400">N/A</span>;
    },
    enableSorting: true,
    size: 80,
    sortingFn: (rowA, rowB) => {
      const scoreA = getAISummaryScore(rowA.original);
      const scoreB = getAISummaryScore(rowB.original);
      
      if (scoreA === null && scoreB === null) return 0;
      if (scoreA === null) return 1;
      if (scoreB === null) return -1;
      
      return parseFloat(scoreA) - parseFloat(scoreB);
    },
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
    sortingFn: (rowA, rowB) => {
      const scoreA = getResumeAnalysisScore(rowA.original, 'resumeScore');
      const scoreB = getResumeAnalysisScore(rowB.original, 'resumeScore');
      
      if (scoreA === null && scoreB === null) return 0;
      if (scoreA === null) return 1;
      if (scoreB === null) return -1;
      
      return scoreA - scoreB;
    },
  },
  {
    accessorKey: "communicationScore",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
      >
        Communication
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const score = getResumeAnalysisScore(row.original, 'communicationScore');
      return (
        <div className="flex justify-center">
          {score === null ? (
            <span className="text-gray-500">N/A</span>
          ) : (
            <ResumeScoreBadge score={score} />
          )}
        </div>
      );
    },
    enableSorting: true,
    size: 120,
    sortingFn: (rowA, rowB) => {
      const scoreA = getResumeAnalysisScore(rowA.original, 'communicationScore');
      const scoreB = getResumeAnalysisScore(rowB.original, 'communicationScore');
      
      if (scoreA === null && scoreB === null) return 0;
      if (scoreA === null) return 1;
      if (scoreB === null) return -1;
      
      return scoreA - scoreB;
    },
  },
  {
    accessorKey: "technicalScore",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
      >
        Technical
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const score = getResumeAnalysisScore(row.original, 'technicalScore');
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
    sortingFn: (rowA, rowB) => {
      const scoreA = getResumeAnalysisScore(rowA.original, 'technicalScore');
      const scoreB = getResumeAnalysisScore(rowB.original, 'technicalScore');
      
      if (scoreA === null && scoreB === null) return 0;
      if (scoreA === null) return 1;
      if (scoreB === null) return -1;
      
      return scoreA - scoreB;
    },
  },
  {
    accessorKey: "cultureFitScore",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
      >
        Culture Fit
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const score = getResumeAnalysisScore(row.original, 'cultureFitScore');
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
    sortingFn: (rowA, rowB) => {
      const scoreA = getResumeAnalysisScore(rowA.original, 'cultureFitScore');
      const scoreB = getResumeAnalysisScore(rowB.original, 'cultureFitScore');
      
      if (scoreA === null && scoreB === null) return 0;
      if (scoreA === null) return 1;
      if (scoreB === null) return -1;
      
      return scoreA - scoreB;
    },
  },
];