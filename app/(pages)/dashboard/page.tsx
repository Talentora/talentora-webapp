import Dashboard from '@/components/Dashboard';
import Sidebar from '@/components/Layout/Sidebar';

const DashboardPage: React.FC = async () => {
  const jobsResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/greenhouse/harvest/jobs`);
  const applicationsResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/greenhouse/harvest/applications`);

  const jobs = jobsResponse.ok ? await jobsResponse.json() : [];
  const applicants = applicationsResponse.ok ? await applicationsResponse.json() : [];

  return (
    <div className="flex flex-row">
      <div className="w-1/6 py-5">
        <Sidebar />
      </div>
      <div className="w-5/6">
        <Dashboard jobs={jobs} applicants={applicants} />
      </div>
    </div>
  );
};

export default DashboardPage;
