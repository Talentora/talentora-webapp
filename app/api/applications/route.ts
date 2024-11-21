import { NextResponse } from 'next/server';
import { getMergeApiKey } from '@/utils/supabase/queries';

export async function GET(request: Request) {
  const accountToken = await getMergeApiKey();
  const baseURL = `https://api.merge.dev/api/ats/v1`;
  const apiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY;

  // Get jobId from query parameters if it exists
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');

  if (!apiKey || !accountToken) {
    return NextResponse.json(
      { error: 'API credentials not found' },
      { status: 500 }
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
      throw new Error(`Failed to fetch applications: ${applicationsResponse.statusText}`);
    }

    const applicationsData = await applicationsResponse.json();
    const applications = applicationsData.results || [];

    // Fetch candidate details, job stage details, and job details for each application and combine them
    const combinedResults = await Promise.all(
      applications.map(async (application: any) => {
        const candidateId = application.candidate;
        const stageId = application.current_stage;
        const applicationJobId = application.job;
        
        if (!candidateId) return null;

        const [candidateResponse, stageResponse, jobResponse] = await Promise.all([
          fetch(`${baseURL}/candidates/${candidateId}`, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${apiKey}`,
              'X-Account-Token': accountToken
            }
          }),
          stageId ? fetch(`${baseURL}/job-interview-stages/${stageId}`, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${apiKey}`,
              'X-Account-Token': accountToken
            }
          }) : null,
          applicationJobId ? fetch(`${baseURL}/jobs/${applicationJobId}`, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${apiKey}`,
              'X-Account-Token': accountToken
            }
          }) : null
        ]);

        if (!candidateResponse.ok) {
          console.error(`Failed to fetch candidate ${candidateId}`);
          return null;
        }

        const candidateData = await candidateResponse.json();
        let stageData = null;
        let jobData = null;
        
        if (stageResponse && stageResponse.ok) {
          stageData = await stageResponse.json();
        } else if (stageId) {
          console.error(`Failed to fetch stage ${stageId}`);
        }

        if (jobResponse && jobResponse.ok) {
          jobData = await jobResponse.json();
        } else if (applicationJobId) {
          console.error(`Failed to fetch job ${applicationJobId}`);
        }

        return {
          application: {
            id: application.id,
            created_at: application.created_at,
            status: application.status,
            current_stage: application.current_stage,
            job_id: application.job
          },
          candidate: candidateData,
          interviewStages: stageData,
          job: jobData
        };
      })
    );

    // Filter out any null values from failed fetches
    const validResults = combinedResults.filter(
      (result) => result !== null
    );

    return NextResponse.json(validResults);
  } catch (error) {
    console.error('Error fetching applications, candidates, stages and jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications, candidates, stages and jobs' },
      { status: 500 }
    );
  }
}
