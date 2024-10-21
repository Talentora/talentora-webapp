import { Job } from '@/types/greenhouse';
import { NextResponse } from 'next/server';
import { getGreenhouseApiKey } from '@/utils/supabase/queries';
const TIMEOUT_MS = 10000; // 10 seconds timeout

export async function GET() {
  const apiKey = await getGreenhouseApiKey();
  console.log("API KEY", apiKey);
  const baseURL = 'https://harvest.greenhouse.io/v1/jobs';

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(baseURL, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: response.status });
    }

    const jobs: Job[] = await response.json();
    console.log('Successfully fetched jobs:', jobs.length);
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timed out' }, { status: 504 });
    }
    return NextResponse.json({ error: 'An error occurred while fetching jobs' }, { status: 500 });
  }
}
