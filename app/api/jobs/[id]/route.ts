// app/api/jobs/[id]/route.ts
import { getMergeApiKey } from '@/utils/supabase/queries';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const accountToken = await getMergeApiKey();
  const jobId = params.id;
  const baseURL = `https://api.merge.dev/api/ats/v1/jobs/${jobId}`;
  const apiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY;

  if (!apiKey || !accountToken) {
    return NextResponse.json({ error: 'API credentials not found' }, { status: 500 });
  }

  try {
    const response = await fetch(baseURL, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Account-Token': accountToken
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch job with id ${jobId}` },
        { status: response.status }
      );
    }

    const job = await response.json();
    return NextResponse.json(job, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while fetching the job' },
      { status: 500 }
    );
  }
}
