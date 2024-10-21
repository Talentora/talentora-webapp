// app/api/jobs/[id]/route.ts
import { getGreenhouseApiKey } from '@/utils/supabase/queries';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const apiKey=await getGreenhouseApiKey();
  const jobId = params.id;
  const baseURL = `https://harvest.greenhouse.io/v1/jobs/${jobId}`;

  // Check if the API key is available
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 });
  }

  try {
    // Fetch the job details from Greenhouse API
    const response = await fetch(baseURL, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
      },
    });

    // Check if the request was successful
    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch job with id ${jobId}` }, { status: response.status });
    }

    const job = await response.json();
    return NextResponse.json(job, { status: 200 });
  } catch (error) {
    // Handle any other errors
    return NextResponse.json({ error: 'An error occurred while fetching the job' }, { status: 500 });
  }
}
