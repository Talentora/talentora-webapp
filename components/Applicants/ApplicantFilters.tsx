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

  // New state for visible columns select
  const [isColumnSelectOpen, setIsColumnSelectOpen] = React.useState(false);

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
                <SelectContent 
                  className="max-h-96 overflow-y-auto" 
                  position="popper" 
                  sideOffset={5}
                  style={{ zIndex: 10000 }}
                >
                  <SelectItem value="all">All Jobs</SelectItem>
                  {jobs && jobs.length > 0 ? (
                    jobs.map((job, index) => {
                      // More robust job data extraction
                      let jobId, jobName;
                      
                      // Debug the job structure
                      console.log(`Job ${index} structure:`, job);
                      
                      // Try different paths to get job ID and name
                      if (job?.mergeJob?.id) {
                        jobId = job.mergeJob.id;
                        jobName = job.mergeJob.name || 'Unnamed Job';
                      } else if (job?.id) {
                        jobId = job.id;
                        jobName = job.name || 'Unnamed Job';
                      } else if (typeof job === 'object') {
                        // Try to find any property that might contain the ID
                        for (const key in job) {
                          if (key.toLowerCase().includes('id') && job[key]) {
                            jobId = job[key];
                            break;
                          }
                        }
                        // Try to find any property that might contain the name
                        for (const key in job) {
                          if (key.toLowerCase().includes('name') && job[key]) {
                            jobName = job[key];
                            break;
                          }
                        }
                      }
                      
                      // If we still don't have an ID or name, use fallbacks
                      jobId = jobId || `job-${index}`;
                      jobName = jobName || `Job ${index + 1}`;
                      
                      console.log(`Extracted Job: ID=${jobId}, Name=${jobName}`);
                      
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
            
            {/* Visible Columns filter - with MultiSelect */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Visible Columns</h5>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsColumnSelectOpen(!isColumnSelectOpen)}
                  className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="truncate">
                    {visibleColumns.length === table.getAllColumns().filter(col => col.getCanHide()).length 
                      ? "All Columns" 
                      : `${visibleColumns.length} column${visibleColumns.length !== 1 ? 's' : ''} selected`}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`h-4 w-4 transition-transform ${isColumnSelectOpen ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                
                {isColumnSelectOpen && (
                  <div 
                    className="absolute z-[10001] w-full mt-1 rounded-md border bg-popover shadow-md"
                    style={{ maxHeight: '300px', overflowY: 'auto' }}
                  >
                    <div className="p-2 bg-background">
                      <div className="flex items-center space-x-2 pb-2 border-b">
                        <Checkbox 
                          id="select-all-columns"
                          checked={visibleColumns.length === table.getAllColumns().filter(col => col.getCanHide()).length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              // Select all columns
                              const allColumnIds = table.getAllColumns()
                                .filter(col => col.getCanHide())
                                .map(col => col.id);
                              
                              // Update each column's visibility
                              table.getAllColumns().forEach(column => {
                                if (column.getCanHide()) {
                                  column.toggleVisibility(true);
                                }
                              });
                              
                              // Update local state
                              setVisibleColumns(allColumnIds);
                            } else {
                              // Deselect all columns (keep at least one)
                              const firstColumnId = table.getAllColumns().find(col => col.getCanHide())?.id;
                              if (firstColumnId) {
                                // Update each column's visibility
                                table.getAllColumns().forEach(column => {
                                  if (column.getCanHide()) {
                                    column.toggleVisibility(column.id === firstColumnId);
                                  }
                                });
                                
                                // Update local state
                                setVisibleColumns([firstColumnId]);
                              }
                            }
                          }}
                        />
                        <Label htmlFor="select-all-columns" className="font-medium">Select All</Label>
                      </div>
                      
                      <div className="pt-2 space-y-2">
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
                                  onCheckedChange={(checked) => {
                                    column.toggleVisibility(!!checked);
                                    setVisibleColumns(
                                      table.getAllColumns()
                                        .filter(col => col.getIsVisible())
                                        .map(col => col.id)
                                    );
                                  }}
                                />
                                <Label htmlFor={`column-${column.id}`}>{columnName}</Label>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {visibleColumns.length} of {table.getAllColumns().filter(col => col.getCanHide()).length} columns visible
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