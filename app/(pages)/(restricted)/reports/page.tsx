import { fetchAllApplications } from "@/server/applications";
import { ApplicantData } from "@/components/Reports/data/mock-data";
import ReportsDashboard from "@/components/Reports/dashboard/ReportsDashboard";

export default async function ReportsPage() {
  // Server-side fetch
  const applicantData: ApplicantData[] = await fetchAllApplications();

  if (!applicantData || applicantData.length === 0) {
    // You could render an error component, throw, or log
    // For now, let's throw an error to prevent rendering the dashboard with no data
    throw new Error("No applicant data found. Please check your data source.");
  }

  return <ReportsDashboard applicantData={applicantData} />;
}