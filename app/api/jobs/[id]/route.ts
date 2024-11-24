// app/api/jobs/[id]/route.ts
import { Job } from '@/types/merge';
import { NextResponse } from 'next/server';
import { getMergeApiKey } from '@/utils/supabase/queries';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const jobId = params.id;
  const baseURL = `https://api.merge.dev/api/ats/v1`;
  const apiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY;
  const headerToken = req.headers.get('X-Account-Token');
  const recruiterToken = await getMergeApiKey();

  console.log("recruiterToken",recruiterToken)
  console.log("headerToken",headerToken)
  const accountToken = recruiterToken || headerToken;
  console.log("accountToken",accountToken)

  if (!apiKey || !accountToken) {
    return NextResponse.json(
      { error: 'API credentials not found' },
      { status: 500 }
    );
  }

  try {
    const jobResponse = await fetch(`${baseURL}/jobs/${jobId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'X-Account-Token': accountToken
      }
    });

    if (!jobResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch job with id ${jobId}` },
        { status: jobResponse.status }
      );
    }

    const jobData = await jobResponse.json();

    // Fetch departments and offices
    const [departmentsResponse, officesResponse] = await Promise.all([
      fetch(`${baseURL}/departments`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'X-Account-Token': accountToken
        }
      }),
      fetch(`${baseURL}/offices`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'X-Account-Token': accountToken
        }
      })
    ]);

    const departments = departmentsResponse.ok
      ? (await departmentsResponse.json()).results
      : [];
    const offices = officesResponse.ok
      ? (await officesResponse.json()).results
      : [];

    const enrichedJob = {
      ...jobData,
      departments,
      offices
    };

    return NextResponse.json(enrichedJob, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while fetching the job' },
      { status: 500 }
    );
  }
}
