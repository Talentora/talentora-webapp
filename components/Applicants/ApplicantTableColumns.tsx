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
  if (!applicant.AI_summary) return null;
  
  if (Array.isArray(applicant.AI_summary) && applicant.AI_summary.length > 0) {
    const sortedSummaries = [...applicant.AI_summary].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    const latestSummary = sortedSummaries[0];
    return latestSummary?.resume_analysis?.[scoreType] || 
           latestSummary?.overall_summary?.[scoreType] || 
           null;
  }
  
  return applicant.AI_summary.resume_analysis?.[scoreType] || 
         applicant.AI_summary.overall_summary?.[scoreType] || 
         applicant.AI_summary[scoreType] || 
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
    cell: ({ row }) => {
      const applicant = row.original;
      const isInvited = hasBeenInvited(applicant);
      const isDisabled = isInvited || 
        (selectedJobId !== "all" && applicant.job?.id !== selectedJobId) || 
        !applicant.candidate;
      
      return isInvited ? (
        <div className="flex items-center text-green-600">
          <Check className="h-4 w-4" />
        </div>
      ) : (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            setSelectedApplicants(prev => 
              value 
                ? [...prev, applicant] 
                : prev.filter(a => a !== applicant)
            );
          }}
          disabled={isDisabled}
          aria-label="Select row"
        />
      );
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => hasBeenInvited(rowA.original) - hasBeenInvited(rowB.original),
    size: 100,
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
        Applied For
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
        Interview
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <InterviewStatus applicant={row.original} />,
    enableSorting: true,
    size: 120,
    sortingFn: (rowA, rowB) => hasCompletedInterview(rowA.original) - hasCompletedInterview(rowB.original),
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
      
      if (applicant.AI_summary) {
        if (Array.isArray(applicant.AI_summary) && applicant.AI_summary.length > 0) {
          const sortedSummaries = [...applicant.AI_summary].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          score = sortedSummaries[0]?.overall_summary?.score;
        } else {
          score = applicant.AI_summary?.overall_summary?.score;
        }
      }
      
      return score !== null && !isNaN(parseFloat(score)) 
        ? <ResumeScoreBadge score={score} />
        : <span className="text-gray-400">N/A</span>;
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
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <Button 
        variant="link" 
        onClick={() => row.original.application?.id && handleViewApplicant(row.original)}
        className="p-0 h-auto font-normal underline"
      >
        View Details
      </Button>
    ),
    enableSorting: false,
    size: 100,
  },
]; 