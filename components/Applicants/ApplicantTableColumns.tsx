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
  
  // Handle if it's an array
  if (Array.isArray(applicant.AI_summary)) {
    if (applicant.AI_summary.length > 0 && applicant.AI_summary[0]?.resume_analysis) {
      return applicant.AI_summary[0].resume_analysis[scoreType] || null;
    }
    return null;
  }
  
  // Handle if it's an object with resume_analysis property
  if (applicant.AI_summary.resume_analysis) {
    return applicant.AI_summary.resume_analysis[scoreType] || null;
  }
  
  // Handle if AI_summary itself contains the scores directly
  return applicant.AI_summary[scoreType] || null;
};

// Score badge component for resume scores
export const ResumeScoreBadge = ({ score }: { score: number | null }) => {
  if (score === null) {
    return <span className="text-gray-500">N/A</span>;
  }
  
  // Determine color based on score value (0-100 scale)
  let badgeVariant = "outline";
  let textColor = "text-gray-700";
  let bgColor = "";
  
  if (score >= 80) {
    badgeVariant = "success";
    textColor = "text-white font-semibold";
    bgColor = "bg-green-600";
  } else if (score >= 60) {
    badgeVariant = "warning";
    textColor = "text-yellow-900 font-semibold";
    bgColor = "bg-yellow-400";
  } else {
    badgeVariant = "destructive";
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
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
            if (value) {
              setSelectedApplicants((prev: any[]) => [...prev, applicant]);
            } else {
              setSelectedApplicants((prev: any[]) => prev.filter((a: any) => a !== applicant));
            }
          }}
          disabled={isDisabled}
          aria-label="Select row"
        />
      );
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const a = hasBeenInvited(rowA.original) ? 1 : 0;
      const b = hasBeenInvited(rowB.original) ? 1 : 0;
      return a - b;
    },
    size: 100,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const applicant = row.original;
      return applicant.candidate ? 
        `${applicant.candidate.first_name} ${applicant.candidate.last_name}` : 
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
        >
          Applied For
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const applicant = row.original;
      return applicant.job?.name || "No job specified";
    },
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const applicant = row.original;
      return applicant.candidate?.email_addresses?.[0]?.value || "No email address";
    },
    enableSorting: true,
    size: 200,
  },
  {
    accessorKey: "interviewConducted",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
        >
          Interview
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const applicant = row.original;
      return <InterviewStatus applicant={applicant} />;
    },
    enableSorting: true,
    size: 120,
    sortingFn: (rowA, rowB) => {
      const a = hasCompletedInterview(rowA.original) ? 1 : 0;
      const b = hasCompletedInterview(rowB.original) ? 1 : 0;
      return a - b;
    },
  },
  {
    accessorKey: "score",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
        >
          Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const applicant = row.original;
      return <ScoreBadge applicant={applicant} />;
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
        >
          Resume Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const applicant = row.original;
      const score = getResumeAnalysisScore(applicant, 'resumeScore');
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
        >
          Communication
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const applicant = row.original;
      const score = getResumeAnalysisScore(applicant, 'communicationScore');
      
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
        >
          Technical
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const applicant = row.original;
      const score = getResumeAnalysisScore(applicant, 'technicalScore');
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={`p-0 hover:bg-transparent ${column.getIsSorted() ? 'font-bold' : ''}`}
        >
          Culture Fit
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const applicant = row.original;
      const score = getResumeAnalysisScore(applicant, 'cultureFitScore');
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
    cell: ({ row }) => {
      const applicant = row.original;
      return (
        <Button 
          variant="link" 
          onClick={() => applicant.application?.id && handleViewApplicant(applicant)}
          className="p-0 h-auto font-normal underline"
        >
          View Details
        </Button>
      );
    },
    enableSorting: false,
    size: 100,
  },
]; 