import { NextResponse } from 'next/server';
import { getMergeApiKey } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';
import { getUserRole } from '@/utils/supabase/queries';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const stageId = params.id;
    
    const supabase = await createClient();
    
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

    // Get the specific job interview stage
    const stageResponse = await fetch(`${baseURL}/job-interview-stages/${stageId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'X-Account-Token': accountToken
      }
    });

    if (!stageResponse.ok) {
      console.error(`Failed to fetch job interview stage with id ${stageId}:`, await stageResponse.text());
      return NextResponse.json(
        { error: `Failed to fetch job interview stage with id ${stageId}` },
        { status: stageResponse.status }
      );
    }

    const stageData = await stageResponse.json();
    return NextResponse.json(stageData, { status: 200 });
    
  } catch (error) {
    console.error('Error in /api/job-interview-stages/[id]:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the job interview stage' },
      { status: 500 }
    );
  }
} 