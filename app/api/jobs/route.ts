import { NextResponse } from 'next/server';
import { getMergeApiKey } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';
import { getUserRole } from '@/utils/supabase/queries';

// Force dynamic rendering for API routes that use cookies
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Add debug logging for auth
    const authResponse = await supabase.auth.getUser();
    console.log('Auth Response:', authResponse);

    

    if (!authResponse.data || !authResponse.data.user) {
      console.error('No user found in auth response:', authResponse);
      return NextResponse.json(
        { error: 'Unauthorized - User not authenticated' },
        { status: 4012 }
      );
    }

    const user = authResponse.data.user;
    // console.log('User found:', user.id);

    // Verify the session is valid
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error('Session error:', sessionError);
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    const role = await getUserRole(supabase, user.id);
    // console.log('User role:', role);

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
      console.log('Missing credentials:', {
        apiKey: !apiKey ? 'missing' : 'present',
        accountToken: !accountToken ? 'missing' : 'present'
      });
      return NextResponse.json(
        { error: 'API credentials not found' },
        { status: 500 }
      );
    }

    const jobsResponse = await fetch(`${baseURL}/jobs`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'X-Account-Token': accountToken
      }
    });

    if (!jobsResponse.ok) {
      console.error('Failed to fetch jobs:', await jobsResponse.text());
      return NextResponse.json(
        { error: 'Failed to fetch jobs' },
        { status: jobsResponse.status }
      );
    }

    const jobsData = await jobsResponse.json();
    const jobs = Array.isArray(jobsData.results) ? jobsData.results : [];


    // Fetch departments and offices once for all jobs
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

    const allDepartments = departmentsResponse.ok ? (await departmentsResponse.json()).results : [];
    const allOffices = officesResponse.ok ? (await officesResponse.json()).results : [];

    // console.log('\n=== Department Data ===');
    // console.log('All departments:', JSON.stringify(allDepartments.map((d: any) => ({ id: d.id, name: d.name })), null, 2));

    // Enrich jobs with their specific departments and offices
    const enrichedJobs = jobs.map((job: any) => {

      // console.log(`\n=== Processing Job: ${job.name} ===`);
      // console.log('Job departments array:', JSON.stringify(job.departments, null, 2));
      
      // The job already has the correct departments, no need to filter
      const jobDepartments = Array.isArray(job.departments) ? job.departments : [];
      const jobOffices = Array.isArray(job.offices) ? job.offices : [];

      const enrichedJob = {
        ...job,
        departments: jobDepartments,
        offices: jobOffices
      };

      // console.log('Enriched job departments:', JSON.stringify(enrichedJob.departments.map((d: any) => ({ id: d.id, name: d.name })), null, 2));
      return enrichedJob;
    });

    return NextResponse.json(enrichedJobs, {
      status: 200,
    });
  } catch (error) {
    console.error('Error in /api/jobs:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching jobs' },
      { status: 500 }
    );
  }
}
