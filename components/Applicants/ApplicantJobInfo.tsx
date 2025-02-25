interface ApplicantJobInfoProps {
  selectedJobId: string;
  jobs?: any[];
  filteredApplicantsCount: number;
}

export const getJobNameById = (jobId: string, jobs?: any[]): string => {
  if (!jobs) return "Unknown Job";
  if (jobId === "all") return "All Jobs";
  
  for (const job of jobs) {
    const id = job.mergeJob?.id || job.id;
    const name = job.mergeJob?.name || job.name;
    
    if (id === jobId) {
      return name || "Unknown Job";
    }
  }
  
  return "Unknown Job";
};

const ApplicantJobInfo = ({ 
  selectedJobId, 
  jobs,
  filteredApplicantsCount 
}: ApplicantJobInfoProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="text-sm text-gray-500">
        {filteredApplicantsCount} candidate{filteredApplicantsCount !== 1 ? 's' : ''} found
      </div>
      {selectedJobId !== "all" && (
        <div className="text-sm">
          Inviting to: <span className="font-medium">{getJobNameById(selectedJobId, jobs)}</span>
        </div>
      )}
    </div>
  );
};

export default ApplicantJobInfo; 