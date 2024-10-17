import RecruiterDashboard from '@/components/RecruiterDashboard';
import Sidebar from '@/components/Layout/Sidebar';
import { createClient } from '@/utils/supabase/server';
import ApplicantDashboard from '@/components/ApplicantDashboard';
const DashboardPage: React.FC = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const role = user?.user_metadata.role;

  let jobs = [];
  let applicants = [];

  if (role === 'recruiter') {
    // fetching data from greenhouse
    const jobsResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/greenhouse/harvest/jobs`);
    const applicationsResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/greenhouse/harvest/applications`);

    // json data
    jobs = jobsResponse.ok ? await jobsResponse.json() : [];
    applicants = applicationsResponse.ok ? await applicationsResponse.json() : [];
  }
  else if (role === 'applicant') {
    const jobsResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/greenhouse/harvest/jobs`);
    jobs = jobsResponse.ok ? await jobsResponse.json() : [];

  }

  return (
    <div>
      {role === 'recruiter' && (
      <div className="flex flex-row">
        <h1>User role : {role}</h1>
        <div className="w-1/6 py-5">
          <Sidebar />
        </div>
        <div className="w-5/6">
            <RecruiterDashboard jobs={jobs} applicants={applicants} />
        </div>
      </div>
      )}

      {role =='applicant' && (
        <ApplicantDashboard
          jobListData={jobs}
        />
      )}
    </div>
  );
};

export default DashboardPage;
