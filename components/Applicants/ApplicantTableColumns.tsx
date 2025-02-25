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
    header: "Status",
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
    enableSorting: false,
    enableHiding: false,
    size: 100,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
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
    size: 150,
  },
  {
    accessorKey: "appliedFor",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
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
    size: 150,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
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
    size: 200,
  },
  {
    accessorKey: "interviewConducted",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
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
          className="p-0 hover:bg-transparent"
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
    size: 100,
  },
]; 