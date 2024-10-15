import { Application } from "@/types/greenhouse"
import { Button } from "@/components/ui/button"
import ApplicantInfo from '@/components/Applicants/Applicant/ApplicantInfo'
import ApplicantSummary from '@/components/Applicants/Applicant/ApplicantSummary'
import InterviewResponses from '@/components/Applicants/Applicant/InterviewResponses'
import ApplicationStatus from '@/components/Applicants/Applicant/ApplicantStatus'
import ApplicantActions from '@/components/Applicants/Applicant/ApplicantActions'

interface ApplicantPortalProps {
  application: Application;
  onBack: () => void;
}

export default function ApplicantPortal({ application, onBack }: ApplicantPortalProps) {
  return (
    <div className="space-y-4">
      <Button onClick={onBack} variant="link">
        &larr; Back to Applicant List
      </Button>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <ApplicantInfo application={application} />
          <ApplicantSummary application={application} />
          <InterviewResponses />
        </div>
        <div className="w-full lg:w-64 space-y-6">
          <ApplicationStatus application={application} />
          <ApplicantActions application={application}/>
        </div>
      </div>
    </div>
  )
}