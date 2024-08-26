import { CardContent } from "@/components/ui/card";
import { Tables } from "@/types/types_db";

type Job = Tables<'jobs'>;

interface JobDetailsProps {
  job: Job;
}

export function JobDetails({ job }: JobDetailsProps) {
  return (
    <CardContent>
      <h3 className="text-lg font-semibold mb-2">Job Description</h3>
      <p className="text-muted-foreground mb-4">
        {job.description}
      </p>
      <h3 className="text-lg font-semibold mb-2">Requirements</h3>
      <ul className="list-disc list-inside text-muted-foreground mb-4">
        {/* Assuming `job.requirements` is an array of strings */}
        {/*{job.requirements.map((requirement, index) => (
          <li key={index}>{requirement}</li>
        ))}*/}
        <li>Requirement 1</li>
        <li>Requirement 2</li>
        <li>Requirement 3</li>
      </ul>
    </CardContent>
  );
}
