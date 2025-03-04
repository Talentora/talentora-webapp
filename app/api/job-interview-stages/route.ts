import { NextResponse } from 'next/server';
import { getMergeApiKey } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';
import { getUserRole } from '@/utils/supabase/queries';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const jobId = url.searchParams.get('job_id');
    
    const supabase = createClient();
    
    // Get authenticated user
    const authResponse = await supabase.auth.getUser();
    if (!authResponse.data || !authResponse.data.user) {
      return NextResponse.json(
        { error: 'Unauthorized - User not authenticated' },
        { status: 401 }
      );
    }

    const user = authResponse.data.user;
    
    // Verify user role
    const role = await getUserRole(supabase, user.id);
    
    let accountToken = null;
    const baseURL = `https://api.merge.dev/api/ats/v1`;
    const apiKey = process.env.NEXT_PUBLIC_MERGE_API_KEY;

    if (role === 'recruiter') {
      accountToken = await getMergeApiKey();
    } else {
      return NextResponse.json(
        { error: 'Unauthorized - Recruiter access required' },
        { status: 403 }
      );
    }

    if (!apiKey || !accountToken) {
      return NextResponse.json(
        { error: 'API credentials not found' },
        { status: 500 }
      );
    }

    // Construct URL with optional job_id parameter
    let stagesUrl = `${baseURL}/job-interview-stages`;
    if (jobId) {
      stagesUrl += `?job_id=${jobId}`;
    }

    const stagesResponse = await fetch(stagesUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'X-Account-Token': accountToken
      }
    });

    if (!stagesResponse.ok) {
      console.error('Failed to fetch job interview stages:', await stagesResponse.text());
      return NextResponse.json(
        { error: 'Failed to fetch job interview stages' },
        { status: stagesResponse.status }
      );
    }

    const stagesData = await stagesResponse.json();
    return NextResponse.json(stagesData, { status: 200 });
    
  } catch (error) {
    console.error('Error in /api/job-interview-stages:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching job interview stages' },
      { status: 500 }
    );
  }
} 