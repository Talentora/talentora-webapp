import { NextResponse } from 'next/server';
import { getMergeApiKey } from '@/utils/supabase/queries';

export async function GET(request: Request) {
  // Retrieve credentials
  const accountToken = await getMergeApiKey();
  const apiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY;
  const baseURL = 'https://api.merge.dev/api/ats/v1';

  // Get jobId from query parameters if it exists
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');

  if (!apiKey || !accountToken) {
    console.error('Missing API credentials', { apiKey, accountToken });
    return NextResponse.json(
      { error: 'API credentials not found' },
      { status: 510 }
    );
  }

  try {
    // Construct URL based on whether jobId is provided
    const applicationsUrl = jobId 
      ? `${baseURL}/applications?job_id=${jobId}`
      : `${baseURL}/applications`;

    const applicationsResponse = await fetch(applicationsUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'X-Account-Token': accountToken
      }
    });

    if (!applicationsResponse.ok) {
      const text = await applicationsResponse.text();
      throw new Error(`Failed to fetch applications: ${applicationsResponse.status} ${applicationsResponse.statusText} - ${text}`);
    }

    const applicationsData = await applicationsResponse.json();
    const applications = applicationsData.results || [];

    const combinedResults = await Promise.all(
      applications.map(async (application: any) => {
        const candidateId = application.candidate;
        const stageId = application.current_stage;
        const applicationJobId = application.job;

        // Skip if no candidateId is provided
        if (!candidateId) {
          console.warn(`No candidateId for application: ${application.id}`);
          return null;
        }

        // Fire all three fetches concurrently (if applicable)
        const candidateFetch = fetch(`${baseURL}/candidates/${candidateId}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'X-Account-Token': accountToken
          }
        });
        const stageFetch = stageId 
          ? fetch(`${baseURL}/job-interview-stages/${stageId}`, {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${apiKey}`,
                'X-Account-Token': accountToken
              }
            })
          : Promise.resolve(null);
        const jobFetch = applicationJobId 
          ? fetch(`${baseURL}/jobs/${applicationJobId}`, {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${apiKey}`,
                'X-Account-Token': accountToken
              }
            })
          : Promise.resolve(null);

        const [candidateResponse, stageResponse, jobResponse] = await Promise.all([
          candidateFetch,
          stageFetch,
          jobFetch
        ]);

        // Check candidate response
        if (!candidateResponse.ok) {
          console.error(`Failed to fetch candidate ${candidateId}: ${candidateResponse.statusText}`);
          return null;
        }
        const candidateData = await candidateResponse.json();

        // Handle stage response
        let stageData = null;
        if (stageResponse) {
          if (stageResponse.ok) {
            stageData = await stageResponse.json();
          } else {
            console.error(`Failed to fetch stage ${stageId}: ${stageResponse.statusText}`);
          }
        }

        // Handle job response
        let jobData = null;
        if (jobResponse) {
          if (jobResponse.ok) {
            jobData = await jobResponse.json();
          } else {
            console.error(`Failed to fetch job ${applicationJobId}: ${jobResponse.statusText}`);
          }
        }

        return {
          application,
          candidate: candidateData,
          interviewStages: stageData,
          job: jobData
        };
      })
    );

    const validResults = combinedResults
    // combinedResults.filter(result => result !== null);
    return NextResponse.json(validResults);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications, candidates, stages and jobs' },
      { status: 500 }
    );
  }
}
