import { ApplicantData } from "../data/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ApplicantTableProps {
  data: ApplicantData[];
  chartFilter?: {
    field: string;
    value: string;
  } | null;
}

export const ApplicantTable = ({ data, chartFilter }: ApplicantTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("application.created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Function to get nested property using dot notation (same as in Graph.tsx)
  const getNestedValue = (obj: any, path: string): any => {
    if (!path) return undefined;
    
    const keys = path.split('.');
    return keys.reduce((o, key) => {
      if (o && typeof o === 'object') {
        // Handle array access with [0] notation
        if (key.includes('[') && key.includes(']')) {
          const arrayKey = key.substring(0, key.indexOf('['));
          const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')));
          return o[arrayKey] && Array.isArray(o[arrayKey]) ? o[arrayKey][index] : undefined;
        }
        return o[key];
      }
      return undefined;
    }, obj);
  };
  
  // Filter data based on chart selection and search query
  const filteredData = data.filter(applicant => {
    // Apply chart filter if present
    if (chartFilter && chartFilter.field && chartFilter.value) {
      const fieldValue = getNestedValue(applicant, chartFilter.field);
      if (String(fieldValue || '') !== String(chartFilter.value)) {
        return false;
      }
    }
    
    // Apply search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const firstName = applicant.candidate?.first_name?.toLowerCase() || '';
      const lastName = applicant.candidate?.last_name?.toLowerCase() || '';
      const jobName = applicant.job?.name?.toLowerCase() || '';
      const stage = applicant.interviewStages?.name?.toLowerCase() || '';
      
      return firstName.includes(lowerQuery) || 
             lastName.includes(lowerQuery) || 
             jobName.includes(lowerQuery) ||
             stage.includes(lowerQuery);
    }
    
    return true;
  });
  
  // Sort the filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = getNestedValue(a, sortField) || '';
    const bValue = getNestedValue(b, sortField) || '';
    
    // Handle date sorting
    if (sortField === 'application.created_at') {
      const aDate = aValue ? new Date(aValue).getTime() : 0;
      const bDate = bValue ? new Date(bValue).getTime() : 0;
      return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
    }
    
    // Default string comparison
    if (sortDirection === 'asc') {
      return String(aValue).localeCompare(String(bValue));
    } else {
      return String(bValue).localeCompare(String(aValue));
    }
  });
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  return (
    <div className="mt-8 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Applicants
          {chartFilter && (
            <Badge variant="outline" className="ml-2 font-normal">
              Filtered by: {chartFilter.field.split('.').pop()} = {chartFilter.value}
            </Badge>
          )}
          <Badge  className="ml-2">
            {sortedData.length} {sortedData.length === 1 ? 'result' : 'results'}
          </Badge>
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applicants..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* <Select
            value={sortField}
            onValueChange={(value) => {
              setSortField(value);
              setSortDirection('asc');
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="candidate.first_name">First Name</SelectItem>
              <SelectItem value="candidate.last_name">Last Name</SelectItem>
              <SelectItem value="job.name">Job</SelectItem>
              <SelectItem value="job.status">Status</SelectItem>
              <SelectItem value="interviewStages.name">Stage</SelectItem>
              <SelectItem value="application.created_at">Application Date</SelectItem>
            </SelectContent>
          </Select> */}
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('candidate.first_name')} className="cursor-pointer">
                Name {sortField === 'candidate.first_name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead onClick={() => handleSort('job.name')} className="cursor-pointer">
                Job {sortField === 'job.name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead onClick={() => handleSort('interviewStages.name')} className="cursor-pointer">
                Stage {sortField === 'interviewStages.name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead onClick={() => handleSort('job.status')} className="cursor-pointer">
                Status {sortField === 'job.status' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead onClick={() => handleSort('application.created_at')} className="cursor-pointer">
                Applied {sortField === 'application.created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((applicant, index) => (
                <TableRow key={applicant.application?.id || index}>
                  <TableCell className="font-medium">
                    {applicant.candidate?.first_name} {applicant.candidate?.last_name}
                  </TableCell>
                  <TableCell>{applicant.job?.name || 'Unknown'}</TableCell>
                  <TableCell>{applicant.interviewStages?.name || 'Unknown'}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${applicant.job?.status === 'OPEN' ? 'bg-green-500' : 'bg-gray-500'}`} />
                      {applicant.job?.status || 'Unknown'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {applicant.application?.created_at 
                      ? formatDistanceToNow(new Date(applicant.application.created_at), { addSuffix: true })
                      : 'Unknown'
                    }
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  No applicants found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}; 