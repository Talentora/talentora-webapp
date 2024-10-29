import { NextResponse } from 'next/server';
import { Application, Candidate } from '@/types/greenhouse';
import { getMergeApiKey } from '@/utils/supabase/queries';

export async function GET(req: Request) {
  const apiKey = await getMergeApiKey();
  const baseURL = `https://harvest.greenhouse.io/v1`;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 });
  }

  const url = new URL(req.url);
  const jobId = url.searchParams.get('jobId');

  try {
    let applicationsResponse;

    if (jobId) {
      applicationsResponse = await fetch(
        `${baseURL}/applications?job_id=${jobId}`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`
          }
        }
      );
    } else {
      applicationsResponse = await fetch(`${baseURL}/applications`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`
        }
      });
    }

    if (!applicationsResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: applicationsResponse.status }
      );
    }

    const applications: Application[] = await applicationsResponse.json();

    // Fetch candidate data for each application
    const applicationsWithCandidates = await Promise.all(
      applications.map(async (application) => {
        const candidateResponse = await fetch(
          `${baseURL}/candidates/${application.candidate_id}`,
          {
            headers: {
              Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`
            }
          }
        );

        if (!candidateResponse.ok) {
          console.error(
            `Failed to fetch candidate data for application ${application.id}`
          );
          return application;
        }

        const candidate: Candidate = await candidateResponse.json();
        return { ...application, candidate };
      })
    );

    return NextResponse.json(applicationsWithCandidates, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while fetching applications' },
      { status: 500 }
    );
  }
}
