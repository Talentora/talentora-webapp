import { NextResponse } from 'next/server';
import { Job } from '@/types/merge';
import { getMergeApiKey } from '@/utils/supabase/queries';

export async function GET() {
  const accountToken = await getMergeApiKey();
  const baseURL = `https://api.merge.dev/api/ats/v1`;
  const apiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY;
  console.log(apiKey, accountToken);

  if (!apiKey || !accountToken) {
    return NextResponse.json(
      { error: 'API credentials not found' },
      { status: 500 }
    );
  }

  try {
    const jobsResponse = await fetch(`${baseURL}/jobs`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'X-Account-Token': accountToken
      }
    });

    if (!jobsResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch jobs' },
        { status: jobsResponse.status }
      );
    }

    const jobsData = await jobsResponse.json();
    const jobs = jobsData.results;

    // Fetch departments and offices for each job
    const enrichedJobs = await Promise.all(
      jobs.map(async (job: any) => {
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

        console.log(departmentsResponse, officesResponse);
        const departments = departmentsResponse.ok
          ? (await departmentsResponse.json()).results
          : [];
        const offices = officesResponse.ok
          ? (await officesResponse.json()).results
          : [];

        return {
          ...job,
          departments,
          offices
        };
      })
    );

    return NextResponse.json(enrichedJobs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while fetching jobs' },
      { status: 500 }
    );
  }
}
