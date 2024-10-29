import { NextResponse } from 'next/server';
import { Job } from '@/types/greenhouse';
import { getMergeApiKey } from '@/utils/supabase/queries';

export async function GET() {
  const accountToken = await getMergeApiKey();
  const baseURL = `https://api.merge.dev/api/ats/v1`;
  const apiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY;
  console.log(apiKey, accountToken);


  if (!apiKey || !accountToken) {
    return NextResponse.json({ error: 'API credentials not found' }, { status: 500 });
  }

  try {
    const jobsResponse = await fetch(`${baseURL}/jobs`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Account-Token': accountToken
      }
    });

    if (!jobsResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch jobs' },
        { status: jobsResponse.status }
      );
    }

    const jobs: Job[] = await jobsResponse.json();

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while fetching jobs' },
      { status: 500 }
    );
  }
}
