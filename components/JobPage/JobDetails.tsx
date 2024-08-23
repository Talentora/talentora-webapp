import { CardContent } from "@/components/ui/card";

export function JobDetails({ job }) {
  return (
    <CardContent>
      <h3 className="text-lg font-semibold mb-2">Job Description</h3>
      <p className="text-muted-foreground mb-4">
        {job.description}
      </p>
      <h3 className="text-lg font-semibold mb-2">Requirements</h3>
      <ul className="list-disc list-inside text-muted-foreground mb-4">
        {job.requirements.map((requirement, index) => (
          <li key={index}>{requirement}</li>
        ))}
      </ul>
    </CardContent>
  );
}
