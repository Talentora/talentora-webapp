import { NextResponse } from 'next/server';
import { Application, Candidate } from '@/types/greenhouse';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const apiKey = process.env.NEXT_PUBLIC_GREENHOUSE_API_KEY;
  const applicationId = params.id;
  const baseURL = `https://harvest.greenhouse.io/v1`;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 });
  }

  try {
    const applicationResponse = await fetch(`${baseURL}/applications/${applicationId}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
      },
    });

    if (!applicationResponse.ok) {
      return NextResponse.json({ error: `Failed to fetch application with id ${applicationId}` }, { status: applicationResponse.status });
    }

    const application: Application = await applicationResponse.json();

    const candidateResponse = await fetch(`${baseURL}/candidates/${application.candidate_id}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
      },
    });

    if (!candidateResponse.ok) {
      console.error(`Failed to fetch candidate data for application ${applicationId}`);
      return NextResponse.json(application, { status: 200 });
    }

    const candidate: Candidate = await candidateResponse.json();
    const applicationWithCandidate = { ...application, candidate };

    return NextResponse.json(applicationWithCandidate, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred while fetching the application' }, { status: 500 });
  }
}
