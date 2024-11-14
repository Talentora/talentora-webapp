import ApplicantPortal from "@/components/Applicants/Applicant/ApplicantPortal";

export default async function ApplicantPage({ params }: { params: { id: string } }) {
  async function getApplicantCandidate() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/applications/${params.id}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('Error fetching application:', response.statusText);
        return null;
      }
      const data = await response.json();
      return data;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Request timed out');
      } else {
        console.error('Error fetching application:', error);
      }
      return null;
    }
  }

  const applicantCandidate = await getApplicantCandidate();
  console.log("applicantCandidate", applicantCandidate);
  
  if (!applicantCandidate) {
    return <div>Failed to fetch applicant candidate</div>;
  }

  console.log("params", params);
//   return <ApplicantPortal ApplicantCandidate={applicantCandidate} />;
}
