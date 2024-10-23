
import RecruiterDashboard from '@/components/RecruiterDashboard';
import ApplicantDashboard from '@/components/ApplicantDashboard';
import { useUser, useRecruiter } from '@/hooks/useUser';

const DashboardPage: React.FC = () => {
  const { user, loading: userLoading } = useUser();
  const { recruiter, loading: recruiterLoading } = useRecruiter(user?.id || '');

  if (userLoading || recruiterLoading) {
    return <div>Loading...</div>;
  }

  const role = user?.user_metadata.role;

  return (
    <div>
      {role === 'recruiter' && (
        <div className="flex flex-row">
          <div>
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
