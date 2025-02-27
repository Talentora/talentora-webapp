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
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex flex-row gap-2">
        {/* Filter button */}
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setIsFilterOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 bg-background h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        
        {/* Invite button */}
        <Button 
          onClick={handleInvite} 
          disabled={selectedApplicants.length === 0 || isInviting || selectedJobId === "all"}
          className="whitespace-nowrap"
        >
          {isInviting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Invite ({selectedApplicants.length})
        </Button>
      </div>
    </div>
  );
};

export default ApplicantTableHeader; 