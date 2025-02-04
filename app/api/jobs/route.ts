import { NextResponse } from 'next/server';
import { Job } from '@/types/merge';
import { getMergeApiKey } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';
import { getUserRole } from '@/middleware';

export async function GET() {
  try {
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
    const jobs = jobsData.results;

    console.log('\n=== API Response Structure ===');
    console.log('Sample Job Structure:', JSON.stringify(jobs[0], null, 2));

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

    console.log('\n=== Department Data ===');
    console.log('All departments:', JSON.stringify(allDepartments.map(d => ({ id: d.id, name: d.name })), null, 2));

    // Enrich jobs with their specific departments and offices
    const enrichedJobs = jobs.map((job: any) => {
      console.log(`\n=== Processing Job: ${job.name} ===`);
      console.log('Job departments array:', JSON.stringify(job.departments, null, 2));
      
      // The job already has the correct departments, no need to filter
      const jobDepartments = Array.isArray(job.departments) ? job.departments : [];
      const jobOffices = Array.isArray(job.offices) ? job.offices : [];

      const enrichedJob = {
        ...job,
        departments: jobDepartments,
        offices: jobOffices
      };

      console.log('Enriched job departments:', JSON.stringify(enrichedJob.departments.map((d: any) => ({ id: d.id, name: d.name })), null, 2));
      return enrichedJob;
    });

    return NextResponse.json(enrichedJobs, { status: 200 });
  } catch (error) {
    console.error('Error in /api/jobs:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching jobs' },
      { status: 500 }
    );
  }
}
