import { ApplicantCandidate } from '@/types/merge';
import { portalProps } from '@/app/(pages)/(restricted)/applicants/[id]/page';

import ApplicantActions from '@/components/Applicants/Applicant/ApplicantActions';

import * as Avatar from '@radix-ui/react-avatar';
import * as Separator from '@radix-ui/react-separator';
import { Calendar, Mail, Phone } from 'lucide-react';

// interface ApplicantCardProps {
//   ApplicantCandidate: ApplicantCandidate | null;
// }

interface ApplicantActionsProps {
  ActionProps: portalProps;
}

export type ApplicantCardProps = {
  ApplicantCandidate: ApplicantCandidate;
} & ApplicantActionsProps;

export function ApplicantCard({
  ApplicantCandidate,
  ActionProps
}: ApplicantCardProps) {
  if (!ApplicantCandidate) {
    return (
      <div className="min-w-max h-full bg-white rounded-2xl shadow-lg p-6 flex space-x-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-500">
            Failed to load candidate information. Please try again later.
          </h3>
        </div>
      </div>
    );
  }

  const candidateName = `${ApplicantCandidate.candidate.first_name} ${ApplicantCandidate.candidate.last_name}`;
  //   const avatarUrl = '/placeholder-avatar.jpg';
  const email =
    ApplicantCandidate.candidate.email_addresses?.[0]?.value ||
    'No email address';
  const phoneNumber =
    ApplicantCandidate.candidate.phone_numbers?.[0]?.value || 'No phone number';
  const jobName = ApplicantCandidate.job.name || 'No job specified';
  const appliedAt = ApplicantCandidate.application.created_at
    ? new Date(ApplicantCandidate.application.created_at).toLocaleDateString()
    : 'Unknown date';

  return (
    <div className="min-w-max h-full bg-white rounded-2xl shadow-lg p-6 flex space-x-6">
      {/* Left column: avatar + name/job/applied date */}
      <div className="flex flex-col items-center space-y-2 flex-shrink-0 self-center">
        <Avatar.Root className="w-24 h-24 rounded-full bg-gray-200">
          <Avatar.Fallback className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-medium">
            {`${ApplicantCandidate.candidate.first_name[0]}${ApplicantCandidate.candidate.last_name[0]}`}
          </Avatar.Fallback>
        </Avatar.Root>

        <div className="text-center space-y-1">
          <h2 className="text-xl font-semibold text-gray-900">
            {candidateName}
          </h2>
          <p className="text-gray-500">{jobName}</p>
          <p className="text-sm text-gray-400">Applied on {appliedAt}</p>
        </div>
      </div>

      {/* Vertical divider */}
      <Separator.Root orientation="vertical" className="w-px bg-gray-200" />

      {/* Right column: invite button, invited date, contact info */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex">
          <div className="w-64">
            <ApplicantActions portalProps={ActionProps} />
          </div>
        </div>
        {/* <div className="flex items-center text-gray-500 mt-2 space-x-1">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">Invited on 12/3/24</span>
        </div> */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900">
            Contact Information:
          </h3>
          <ul className="mt-2 space-y-2">
            <li className="flex items-center space-x-2 text-gray-700">
              <Mail className="w-5 h-5" />
              <a
                href="mailto:bengardiner@gmail.com"
                className="hover:underline"
              >
                {email}
              </a>
            </li>
            <li className="flex items-center space-x-2 text-gray-700">
              <Phone className="w-5 h-5" />
              <span>{phoneNumber}</span>
            </li>
            {/* <li className="flex items-center text-gray-700">
              <span className="font-medium">Current Stage:</span>
              <span className="ml-1">Under Review</span>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ApplicantCard;
