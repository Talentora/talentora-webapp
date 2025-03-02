import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface ApplicantTableHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedApplicants: any[];
  isInviting: boolean;
  handleInvite: () => void;
  selectedJobId: string;
  setIsFilterOpen: (value: boolean) => void;
  activeFilterCount: number;
}

const ApplicantTableHeader = ({
  searchTerm,
  setSearchTerm,
  selectedApplicants,
  isInviting,
  handleInvite,
  selectedJobId,
  setIsFilterOpen,
  activeFilterCount
}: ApplicantTableHeaderProps) => {
  return (
    <div className="flex flex-col space-y-1">
      {/* Search bar */}
      <div className="w-full">
        <Input
          placeholder="Search applicants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Buttons row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleInvite}
            disabled={selectedApplicants.length === 0 || selectedJobId === "all" || isInviting}
          >
            {isInviting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inviting...
              </>
            ) : (
              'Invite Selected'
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFilterOpen(true)}
            className="relative"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantTableHeader;