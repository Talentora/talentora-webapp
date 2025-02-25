import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table } from "@tanstack/react-table";
import React from 'react';

interface ApplicantFiltersProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (value: boolean) => void;
  selectedJobId: string;
  setSelectedJobId: (value: string) => void;
  invitationStatus: string;
  setInvitationStatus: (value: string) => void;
  interviewStatus: string;
  setInterviewStatus: (value: string) => void;
  scoreThreshold: number[];
  setScoreThreshold: (value: number[]) => void;
  jobs?: any[];
  table: Table<any>;
  activeFilterCount: number;
  children: React.ReactNode;
}

const ApplicantFilters = ({
  isFilterOpen,
  setIsFilterOpen,
  selectedJobId,
  setSelectedJobId,
  invitationStatus,
  setInvitationStatus,
  interviewStatus,
  setInterviewStatus,
  scoreThreshold,
  setScoreThreshold,
  jobs,
  table,
  activeFilterCount,
  children
}: ApplicantFiltersProps) => {
  // Get score data from the table for the histogram
  const scoreData = React.useMemo(() => {
    const data = table.getFilteredRowModel().rows
      .map(row => row.original.score)
      .filter(score => typeof score === 'number' && !isNaN(score));
    
    console.log("Score data for histogram:", data); // Debug log
    return data;
  }, [table]);

  // Track visible columns - fix initialization and update logic
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>(() => 
    table.getAllColumns().filter(column => column.getIsVisible()).map(column => column.id)
  );

  // Update visible columns when table columns change
  React.useEffect(() => {
    setVisibleColumns(
      table.getAllColumns().filter(column => column.getIsVisible()).map(column => column.id)
    );
  }, [table.getAllColumns().map(col => col.getIsVisible()).join(',')]);

  // Handle column visibility changes
  const handleColumnVisibilityChange = (columnId: string) => {
    const column = table.getColumn(columnId);
    if (column) {
      column.toggleVisibility();
    }
  };

  // Handle multiple column selection
  const handleColumnsChange = (value: string) => {
    const selectedColumns = value.split(',');
    
    // Update each column's visibility
    table.getAllColumns().forEach(column => {
      if (column.getCanHide()) {
        column.toggleVisibility(selectedColumns.includes(column.id));
      }
    });
    
    // Update local state
    setVisibleColumns(selectedColumns);
  };

  // Debug logs
  React.useEffect(() => {
    console.log("Jobs data in ApplicantFilters:", jobs);
    console.log("Table columns:", table.getAllColumns().map(col => ({ id: col.id, visible: col.getIsVisible() })));
    console.log("Score threshold:", scoreThreshold);
  }, [jobs, table, scoreThreshold]);

  return (
    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-4/5 h-4/5 p-4 bg-background" style={{ zIndex: 9999, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', height: '80vh', overflowY: 'auto' }}>
        <div className="space-y-4">
          <h4 className="font-medium">Filter Options</h4>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Job filter - improved rendering and error handling */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Job</h5>
              <Select 
                value={selectedJobId || 'all'} 
                onValueChange={(value) => {
                  console.log("Selected job ID:", value);
                  setSelectedJobId(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {jobs && jobs.length > 0 ? (
                    jobs.map((job) => {
                      // Improved job data extraction with fallbacks
                      const jobId = job?.mergeJob?.id || job?.id || '';
                      const jobName = job?.mergeJob?.name || job?.name || 'Unnamed Job';
                      
                      if (!jobId) return null;
                      
                      return (
                        <SelectItem key={jobId} value={jobId}>
                          {jobName}
                        </SelectItem>
                      );
                    })
                  ) : (
                    <SelectItem value="no-jobs" disabled>No jobs available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {/* Visible Columns filter - fixed to handle multiple selection */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Visible Columns</h5>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                {table.getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    const columnName = column.id === 'dataStatus' 
                      ? 'Data Status' 
                      : column.id.charAt(0).toUpperCase() + column.id.slice(1);
                    
                    return (
                      <div key={column.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`column-${column.id}`}
                          checked={column.getIsVisible()}
                          onCheckedChange={() => handleColumnVisibilityChange(column.id)}
                        />
                        <Label htmlFor={`column-${column.id}`}>{columnName}</Label>
                      </div>
                    );
                  })}
              </div>
            </div>
            
            {/* Invitation Status filter */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Invitation Status</h5>
              <RadioGroup 
                value={invitationStatus}
                onValueChange={setInvitationStatus}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="invitation-all" />
                  <Label htmlFor="invitation-all">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="invited" id="invitation-invited" />
                  <Label htmlFor="invitation-invited">Invited</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not_invited" id="invitation-not-invited" />
                  <Label htmlFor="invitation-not-invited">Not Invited</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Interview Status filter */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Interview Status</h5>
              <RadioGroup 
                value={interviewStatus}
                onValueChange={setInterviewStatus}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="interview-all" />
                  <Label htmlFor="interview-all">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="completed" id="interview-completed" />
                  <Label htmlFor="interview-completed">Completed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not_completed" id="interview-not-completed" />
                  <Label htmlFor="interview-not-completed">Not Completed</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Score Threshold filter */}
            <div className="space-y-2 col-span-2">
              <div className="flex justify-between">
                <h5 className="text-sm font-medium">Score Range</h5>
                <span className="text-sm text-muted-foreground">
                  {scoreThreshold[0]} - {scoreThreshold[1]}
                </span>
              </div>
              <div className="py-4">
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={scoreThreshold}
                  onValueChange={setScoreThreshold}
                  className="my-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
                {scoreData.length > 0 && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    {scoreData.length} applicants with scores in this range
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsFilterOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => setIsFilterOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ApplicantFilters; 