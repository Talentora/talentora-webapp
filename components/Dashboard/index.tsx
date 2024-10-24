"use client";

import RecruiterDashboard from '@/components/Dashboard/RecruiterDashboard';
import ApplicantDashboard from '@/components/Dashboard/ApplicantDashboard';
import { useUser } from '@/hooks/useUser';

const DashboardPage = () => {
  const {user} = useUser();
  const role = user?.role;


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
