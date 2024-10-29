import { NextResponse } from 'next/server';
import { Application, Job, Candidate } from '@/types/merge';
import { getMergeApiKey } from '@/utils/supabase/queries';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const accountToken = await getMergeApiKey();
  const applicationId = params.id;
  const baseURL = `https://api.merge.dev/api/ats/v1`;
  const apiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY;

  if (!apiKey || !accountToken) {
    return NextResponse.json({ error: 'API credentials not found' }, { status: 500 });
  }

  if (!applicationId) {
    return NextResponse.json(
      { error: 'Application ID is missing' },
      { status: 400 }
    );
  }

  try {
    // Fetch application details
    const applicationResponse = await fetch(
      `${baseURL}/applications/${applicationId}`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'X-Account-Token': accountToken
        }
      }
    );

    if (!applicationResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch application with id ${applicationId}` },
        { status: applicationResponse.status }
      );
    }

    const application:Application = await applicationResponse.json();
    const candidateId = application.candidate;
    console.log("Application:",application);
    console.log("Candidate ID:",candidateId);

    // Fetch candidate details
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

    if (!candidateResponse.ok) {
      console.error(
        `Failed to fetch candidate data for application ${applicationId}`
      );
      // Return the application data without candidate details
      return NextResponse.json(application, { status: 200 });
    }

    const candidate:Candidate = await candidateResponse.json();
    console.log("Candidate:",candidate);
    const applicationWithCandidate = { ...application, candidate };

    return NextResponse.json(applicationWithCandidate, { status: 200 });
  } catch (error) {
    console.error(
      `An error occurred while fetching the application or candidate:`,
      error
    );
    return NextResponse.json(
      { error: 'An error occurred while fetching the application' },
      { status: 500 }
    );
  }
}
