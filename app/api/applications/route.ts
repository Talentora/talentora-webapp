import { NextResponse } from 'next/server';
import { getMergeApiKey } from '@/utils/supabase/queries';
import { Application } from '@/types/merge';
export async function GET(req: Request) {
  const accountToken = await getMergeApiKey();
  const baseURL = `https://api.merge.dev/api/ats/v1`;
  const apiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY;

  if (!apiKey || !accountToken) {
    return NextResponse.json({ error: 'API credentials not found' }, { status: 500 });
  }

  const url = new URL(req.url);
  const jobId = url.searchParams.get('jobId');

  try {
    let applicationsResponse;

    if (jobId) {
      applicationsResponse = await fetch(
        `${baseURL}/applications?job_post_id=${jobId}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'X-Account-Token': accountToken
          }
        }
      );
    } else {
      applicationsResponse = await fetch(`${baseURL}/applications`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'X-Account-Token': accountToken
        }
      });
    }

    if (!applicationsResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: applicationsResponse.status }
      );
    }

    const applications = await applicationsResponse.json();

    // Fetch candidate, job and current stage data for each application
    const applicationsWithDetails = await Promise.all(
      applications.results.map(async (application: Application) => {
        const candidateId = application.candidate;
        const jobId = application.job;

        // Fetch candidate data
        const candidateResponse = await fetch(
          `${baseURL}/candidates/${candidateId}`,
          {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
              'X-Account-Token': accountToken
            }
          }
        );

        // Fetch job data
        const jobResponse = await fetch(
          `${baseURL}/jobs/${jobId}`,
          {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
              'X-Account-Token': accountToken
            }
          }
        );
        // Fetch current stage data
        console.log("Current Stage:", application.current_stage);
        const stagesResponse = await fetch(
          `${baseURL}/job-interview-stages/${application.current_stage}`,
          {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
              'X-Account-Token': accountToken
            }
          }
        );

        let candidate, job, interviewStages;

        if (!candidateResponse.ok) {
          console.error(
            `Failed to fetch candidate data for application ${application.id}`
          );
        } else {
          candidate = await candidateResponse.json();
        }

        if (!jobResponse.ok) {
          console.error(
            `Failed to fetch job data for application ${application.id}`
          );
        } else {
          job = await jobResponse.json();
        }

        if (!stagesResponse.ok) {
          console.error(
            `Failed to fetch interview stages for application ${application.id}`
          );
        } else {
          const stagesData = await stagesResponse.json();
          console.log("Stages Data:", stagesData);
          interviewStages = stagesData;
          console.log("Interview Stages:", interviewStages);
        }

        return {
          ...application,
          candidate: candidate || null,
          job: job || null,
          interviewStages: interviewStages || []
        };
      })
    );

    return NextResponse.json(applicationsWithDetails, { status: 200 });
  } catch (error) {
    console.error(
      `An error occurred while fetching applications, candidates, jobs or stages:`,
      error
    );
    return NextResponse.json(
      { error: 'An error occurred while fetching applications' },
      { status: 500 }
    );
  }
}
