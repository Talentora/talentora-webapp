'use client';

import { useRouter } from 'next/navigation';
import { ApplicantCandidate } from '@/types/merge';
import { Briefcase, Sparkles, ChevronRight } from 'lucide-react'; // Import the briefcase icon
import { formatDistanceToNow } from 'date-fns'; // Import the function to calculate time difference

interface ApplicantTableProps {
  applicants: ApplicantCandidate[];
  disablePortal?: boolean;
}

export default function ApplicantTable({
  applicants,
  disablePortal = false,
}: ApplicantTableProps) {
  const router = useRouter();

  const handleSelectApplicant = (applicant: ApplicantCandidate) => {
    router.push(`/applicants/${applicant.application.id}`);
  };

  // Function to get the initials of the applicant
  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  // Function to generate a random gradient color for the avatar background
  const getGradientBackground = () => {
    const gradients = [
      'bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500',
      'bg-gradient-to-r from-pink-400 via-purple-600 to-orange-600',
      'bg-gradient-to-r from-purple-500 via-pink-600 to-pink-400',
      'bg-gradient-to-r from-orange-400 via-purple-500 to-pink-600',
      'bg-gradient-to-r from-pink-500 via-orange-500 to-purple-400',
    ];
    const randomIndex = Math.floor(Math.random() * gradients.length);
    return gradients[randomIndex];
  };

  // Function to get the time difference in a human-readable format
  const getTimeAgo = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <div className="grid gap-4  max-h-[500px] overflow-y-auto  rounded-lg">
      {applicants.map((applicant) => (
        <div
          key={applicant.application.id}
          onClick={() => handleSelectApplicant(applicant)}
          className="relative flex flex-col justify-between p-4 border rounded-lg shadow-sm bg-white dark:bg-input hover:shadow-md cursor-pointer"
        >
   
          <div className="flex items-center gap-4">
            {/* Avatar with initials and dynamic gradient background */}
            <div className={`w-12 h-12 rounded-full text-white flex items-center justify-center font-normal ${getGradientBackground()}`}>
              {getInitials(applicant.candidate.first_name, applicant.candidate.last_name)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary">
                {`${applicant.candidate.first_name} ${applicant.candidate.last_name}`}
              </h2>

              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                <p className="-ml-1 text-sm text-primary">
                  {applicant.job.name || 'No job specified'}
                </p>
              </div>

              {/* Scores Section */}
              <div className="mt-2 flex gap-4 text-sm text-primary">
                {/* AI Score */}
                <div className="flex items-center ">
                  <span className="text-lg text-green-600">
                    {applicant.application.ai_score ? `${applicant.application.ai_score}%` : '80%'}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-l border-input h-6 "></div>

                {/* Overall Score */}
                <div className="flex items-center ">
                  <span className="text-lg text-green-500">
                    {applicant.application.ai_score ? `${applicant.application.ai_score}%` : '74%'}
                  </span>
                </div>
              </div>

              {/* Applied At (Time Ago) */}
              <p className="text-sm text-primary mt-2">
                Applied {getTimeAgo(applicant.application.applied_at)}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSelectApplicant(applicant);
            }}
            className="-mt-5 text-blue-600 underline hover:text-blue-800 flex justify-end items-center"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>
        </div>
      ))}
    </div>
  );
}
