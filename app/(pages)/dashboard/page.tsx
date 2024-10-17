import RecruiterDashboard from '@/components/RecruiterDashboard';
import Sidebar from '@/components/Layout/Sidebar';
import { createClient } from '@/utils/supabase/server';
import ApplicantDashboard from '@/components/ApplicantDashboard';

const DashboardPage: React.FC = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const role = user?.user_metadata.role;

  return (
    <div>
      {role === 'recruiter' && (
      <div className="flex flex-row">
        <div className="w-1/6 py-5">
          <Sidebar />
        </div>
        <div className="w-5/6">
          <RecruiterDashboard />
        </div>
      </div>
      )}

      {role === 'applicant' && (
        <ApplicantDashboard />
      )}
    </div>
  );
};

export default DashboardPage;