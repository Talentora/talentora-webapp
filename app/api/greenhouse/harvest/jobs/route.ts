// app/api/jobs/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_GREENHOUSE_API_KEY;
  const baseURL = 'https://harvest.greenhouse.io/v1/jobs';

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 });
  }

  try {
    const response = await fetch(baseURL, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: response.status });
    }

    const jobs = await response.json();
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred while fetching jobs' }, { status: 500 });
  }
}
