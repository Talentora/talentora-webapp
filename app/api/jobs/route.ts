import { NextResponse } from 'next/server';
import { Job } from '@/types/greenhouse';
import { getGreenhouseApiKey } from '@/utils/supabase/queries';

export async function GET() {
  const apiKey = await getGreenhouseApiKey();
  const baseURL = `https://harvest.greenhouse.io/v1`;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 });
  }

  try {
    const jobsResponse = await fetch(`${baseURL}/jobs`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
      },
    });

    if (!jobsResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: jobsResponse.status });
    }

    const jobs: Job[] = await jobsResponse.json();

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred while fetching jobs' }, { status: 500 });
  }
}
