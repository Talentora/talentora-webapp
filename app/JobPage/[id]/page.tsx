import JobPage from "@/components/JobPage";

export default async function Page({ params }: { params: { id: string } }) {
  const job = await fetchJobData(params.id);

  return (
    <div>
      <JobPage job={job} />
    </div>
  );
}

async function fetchJobData(id: string) {
  // Example data fetching logic. Replace this with your actual data source.
  return {
    title: "Senior Frontend Developer",
    type: "Full-time",
    location: "Remote",
    salary: "$80k - $120k",
    postedDate: "Posted 2 weeks ago",
    description: "We are seeking an experienced Frontend Developer to join our dynamic team. The ideal candidate will have a strong background in React, TypeScript, and modern web technologies.",
    requirements: [
      "5+ years of experience in frontend development",
      "Proficiency in React, TypeScript, and state management libraries",
      "Experience with responsive design and cross-browser compatibility",
      "Strong problem-solving skills and attention to detail",
    ],
  };
}
