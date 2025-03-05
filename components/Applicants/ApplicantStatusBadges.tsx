import { Badge } from "@/components/ui/badge";
import { Check, XCircle, X } from 'lucide-react';

// Helper function to determine if an applicant has completed an interview
export const hasCompletedInterview = (applicant: any): boolean => {
  // Check if there's a valid AI_summary property
  if (!applicant.AI_summary) return false;
  
  // Check if it's an empty array
  if (Array.isArray(applicant.AI_summary) && applicant.AI_summary.length === 0) return false;

  // If it's an array with content or an object, consider it valid
  return true;
};

// Helper function to get the AI summary score
export const getAISummaryScore = (applicant: any): string | null => {
  // Check if AI_summary exists
  if (!applicant.AI_summary) return null;
  
  // Handle if it's an array
  if (Array.isArray(applicant.AI_summary)) {
    // Return score from first item if available
    if (applicant.AI_summary.length > 0 && 
        applicant.AI_summary[0]?.overall_summary?.score) {
      return applicant.AI_summary[0].overall_summary.score;
    }
    return null;
  }
  
  // Handle if it's an object
  if (applicant.AI_summary?.overall_summary?.score) {
    return applicant.AI_summary.overall_summary.score;
  }
  
  return null;
};

// Helper function to determine if an applicant has been invited
export const hasBeenInvited = (applicant: any): boolean => {
  // Check if there's an invitation_sent property in the application
  return Boolean(applicant.application?.invitation_sent);
};

interface StatusBadgeProps {
  applicant: any;
}

export const StatusBadge = ({ applicant }: StatusBadgeProps) => {
  if (hasCompletedInterview(applicant)) {
    return <Badge variant="success">Interview Completed</Badge>;
  } else if (hasBeenInvited(applicant)) {
    return <Badge variant="warning">Invited</Badge>;
  } else {
    return <Badge variant="outline">Not Invited</Badge>;
  }
};

interface DataStatusBadgeProps {
  applicant: any;
  dataType: 'supabase' | 'merge' | 'ai';
}

export const DataStatusBadge = ({ applicant, dataType }: DataStatusBadgeProps) => {
  if (dataType === 'supabase' && applicant.hasSupabaseData) {
    return <Badge variant="success" className="flex items-center gap-1 text-xs px-1"><Check className="h-3 w-3" />SB</Badge>;
  } else if (dataType === 'merge' && applicant.hasMergeData) {
    return <Badge variant="success" className="flex items-center gap-1 text-xs px-1"><Check className="h-3 w-3" />MG</Badge>;
  } else if (dataType === 'ai' && hasCompletedInterview(applicant)) {
    return <Badge variant="success" className="flex items-center gap-1 text-xs px-1"><Check className="h-3 w-3" />AI</Badge>;
  } else {
    return <Badge variant="destructive" className="flex items-center gap-1 text-xs px-1"><XCircle className="h-3 w-3" />{dataType === 'supabase' ? 'SB' : dataType === 'merge' ? 'MG' : 'AI'}</Badge>;
  }
};

interface ScoreBadgeProps {
  applicant: any;
}

export const ScoreBadge = ({ applicant }: ScoreBadgeProps) => {
  const score = getAISummaryScore(applicant);
  
  if (!score) {
    return <span className="text-gray-500">No Score</span>;
  }
  
  // Parse the score to a number
  const numScore = parseFloat(score);
  
  // Determine color based on score value (stoplight scale)
  let badgeVariant = "outline";
  let textColor = "text-gray-700";
  let bgColor = "";
  
  if (!isNaN(numScore)) {
    if (numScore < 3) {
      badgeVariant = "destructive";
      textColor = "text-white font-semibold";
      bgColor = "bg-red-600";
    } else if (numScore < 4) {
      badgeVariant = "warning";
      textColor = "text-yellow-900 font-semibold";
      bgColor = "bg-yellow-400";
    } else {
      badgeVariant = "success";
      textColor = "text-white font-semibold";
      bgColor = "bg-green-600";
    }
  }
  
  return (
    <Badge variant={badgeVariant as any} className={`font-mono ${textColor} ${bgColor}`}>
      {score}
    </Badge>
  );
};

interface InterviewStatusProps {
  applicant: any;
}

export const InterviewStatus = ({ applicant }: InterviewStatusProps) => {
  return hasCompletedInterview(applicant) ? (
    <div className="flex items-center justify-center text-green-600">
      <Check className="h-6 w-4 mr-1" />
    </div>
  ) : (
    <div className="flex items-center justify-center text-gray-500">
      <X className="h-6 w-4 mr-1" />
    </div>
  );
}; 