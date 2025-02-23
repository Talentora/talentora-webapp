import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export const revalidate = 60; // Revalidate every minute

export async function GET() {
  try {
    const supabase = createClient();
    
    const authResponse = await supabase.auth.getUser();
    if (!authResponse.data?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = authResponse.data.user.id;

    // Fetch applicant data with all related information in a single query
    const { data: applicantData, error: applicantError } = await supabase
      .from('applicants')
      .select(`
        *,
        applications:applications (
          *,
          AI_summary:AI_summary (*),
          job:jobs (*),
          company:companies (*)
        )
      `)
      .eq('id', userId)
      .single();

    if (applicantError) {
      console.error('Error fetching applicant data:', applicantError);
      return NextResponse.json(
        { error: 'Failed to fetch applicant data' },
        { status: 500 }
      );
    }

    // Process and enrich the data
    const enrichedApplications = applicantData.applications.map(app => ({
      ...app,
      status: app.AI_summary ? 'complete' : 'incomplete',
      job: app.job,
      company: app.company,
      ai_summary: app.AI_summary
    }));

    // Sort applications by creation date
    const sortedApplications = enrichedApplications.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({
      applicant: {
        ...applicantData,
        applications: sortedApplications
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Error in /api/applicants:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching applicant data' },
      { status: 500 }
    );
  }
} 