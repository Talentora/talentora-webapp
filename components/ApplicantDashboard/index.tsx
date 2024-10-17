import { CardView } from "../Jobs/CardView"; 
import { Job } from "@/types/greenhouse";

interface ApplicantDashboardProps {
    jobListData: Job[];
}

const ApplicantDashboard: React.FC<ApplicantDashboardProps> = ({ jobListData }) => {
    return (
        <div>
            <h1>Applicant Dashboard</h1>
            <CardView 
                cardViewData={{
                    filteredJobs: jobListData,
                    onDeleteJob: () => {}
                }}
            />
        </div>
    )
}

export default ApplicantDashboard;