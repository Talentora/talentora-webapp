import { NextResponse } from 'next/server';
import { Application, Job, Candidate } from '@/types/merge';
import { getMergeApiKey } from '@/utils/supabase/queries';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const accountToken = await getMergeApiKey();
  const baseURL = `https://api.merge.dev/api/ats/v1`;
  const apiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY;
  if (!apiKey) {
    console.error('NEXT_PUBLIC_MERGE_API_KEY is missing');
  }
  
  if (!accountToken) {
    console.error('Account Token is missing');
  }
  if (!apiKey || !accountToken) {
    return NextResponse.json(
      { error: 'API credentials not found' },
      { status: 500 }
    );
  }

  if (!id) {
    return NextResponse.json(
      { error: 'Application ID is missing' },
      { status: 400 }
    );
  }

  try {
    // Fetch application details
    const applicationResponse = await fetch(
      `${baseURL}/applications/${id}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'X-Account-Token': accountToken
        }
      }
    );

    if (!applicationResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch application with id ${id}` },
        { status: applicationResponse.status }
      );
    }

    const application: Application = await applicationResponse.json();
    const candidateId = application.candidate;
    const stageId = application.current_stage;
    const jobId = application.job;

    // Fetch candidate, stage and job details in parallel
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
      jobId ? fetch(`${baseURL}/jobs/${jobId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'X-Account-Token': accountToken
        }
      }) : null
    ]);

    let candidateData = null;
    let stageData = null;
    let jobData = null;

    if (candidateResponse.ok) {
      candidateData = await candidateResponse.json();
    } else {
      console.error(`Failed to fetch candidate ${candidateId}`);
    }

    if (stageResponse && stageResponse.ok) {
      stageData = await stageResponse.json();
    } else if (stageId) {
      console.error(`Failed to fetch stage ${stageId}`);
    }

    if (jobResponse && jobResponse.ok) {
      jobData = await jobResponse.json();
    } else if (jobId) {
      console.error(`Failed to fetch job ${jobId}`);
    }

    const enrichedApplication = {
      application: {
        id: application.id,
        created_at: application.created_at,
        current_stage: application.current_stage,
        job_id: application.job
      },
      candidate: candidateData,
      interviewStages: stageData,
      job: jobData
    };

    return NextResponse.json(enrichedApplication, { status: 200 });

  } catch (error) {
    console.error(
      `An error occurred while fetching the application data:`,
      error
    );
    return NextResponse.json(
      { error: 'Failed to fetch application data and related resources' },
      { status: 500 }
    );
  }
}
