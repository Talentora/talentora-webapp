// app/api/jobs/[id]/route.ts
import { Job } from '@/types/merge';
import { NextResponse } from 'next/server';
import { getMergeApiKey } from '@/utils/supabase/queries';
import { getUserRole } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - User not found' },
        { status: 401 }
      );
    }

    const role = await getUserRole(supabase, user.id);
    let accountToken = null;
    const baseURL = `https://api.merge.dev/api/ats/v1`;
    const apiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY;

    if (role === 'recruiter') {
      accountToken = await getMergeApiKey();
    } else if (role === 'applicant') {
      const headerToken = req.headers.get('X-Account-Token');
      if (!headerToken) {
        return NextResponse.json(
          { error: 'Unauthorized - Account token required' },
          { status: 401 }
        );
      }
      accountToken = headerToken;
    } else {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid role' },
        { status: 403 }
      );
    }

    if (!apiKey || !accountToken) {
      return NextResponse.json(
        { error: 'API credentials not found' },
        { status: 500 }
      );
    }

    const jobResponse = await fetch(`${baseURL}/jobs/${jobId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'X-Account-Token': accountToken
      }
    });

    if (!jobResponse.ok) {
      console.error('Failed to fetch job:', await jobResponse.text());
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

    const departments = departmentsResponse.ok ? (await departmentsResponse.json()).results : [];
    const offices = officesResponse.ok ? (await officesResponse.json()).results : [];

    const enrichedJob = {
      ...jobData,
      departments,
      offices
    };

    return NextResponse.json(enrichedJob, { status: 200 });
  } catch (error) {
    console.error('Error in /api/jobs/[id]:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the job' },
      { status: 500 }
    );
  }
}
