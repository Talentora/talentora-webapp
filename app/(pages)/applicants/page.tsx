// import CandidateList from "@/components/Applicants/candidate-list";
import ApplicantList from "@/components/Applicants/ApplicantList";
import { Application } from "@/types/greenhouse";

const Page = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/greenhouse/harvest/applications`, { cache: 'no-store' });
    const applications: Application[] = await response.json();

    return (
        <ApplicantList
            applications={applications}
        />
    )
}

export default Page;