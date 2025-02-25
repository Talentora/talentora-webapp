import { getURL } from '@/utils/helpers';
import { getMergeApiKey } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/client';

const API_URL = process.env.NEXT_PUBLIC_DATABASE_URL;

// Simple in-memory cache implementation
const cache = {
  data: new Map<string, any>(),
  set(key: string, value: any, ttlSeconds: number): void {
    const expiryTime = Date.now() + (ttlSeconds * 1000);
    this.data.set(key, { value, expiryTime });
  },
  get(key: string): any {
    const item = this.data.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiryTime) {
      this.data.delete(key);
      return null;
    }
    
    return item.value;
  },
  clear(): void {
    this.data.clear();
  }
};

export async function fetchApplicationsData() {
    const response = await fetch(getURL('api/applications'), {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'force-cache',
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      throw new Error(`Applications fetch failed: ${response.status}`);
    }
    
    return response.json();
  }
  

export async function fetchApplicationData(mergeApplicationId: string) {
    const response = await fetch(getURL(`api/applications/${mergeApplicationId}`), {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'force-cache',
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      throw new Error(`Applications fetch failed: ${response.status}`);
    }
    
    return response.json();
  }


// Fetch application data with AI summary. The applicaiton Id is merge id
export async function fetchApplicationAISummary(mergeApplicationId: string) {
    const accountToken = await getMergeApiKey();
    if (!accountToken) {
        throw new Error('Account token not found');
    }
    
    const params = new URLSearchParams({
        account_token: accountToken,
        add_AI_summary: "true"
    });
    const url = `${API_URL}/merge/application/${mergeApplicationId}?${params.toString()}`;


    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'force-cache',
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      throw new Error(`Applications fetch failed: ${response.status}`);
    }
    
    return response.json();
  }

// New function to fetch applicants with joined data from Supabase and Merge API
export async function fetchJoinedApplicantsData() {
  try {
    // Get Merge API data for all applicants first
    const mergeApplicants = await fetchApplicationsData();
    
    // Extract merge applicant IDs
    const mergeApplicantIds = mergeApplicants.map((ma: any) => ma.application.id);
    
    // Try to get Supabase data
    let supabaseData: any[] = [];
    try {
      const supabase = createClient();
      
      // Get applications matching merge IDs with their related applicants and AI summaries
      const { data: applicantsData, error: applicantsError } = await supabase
        .from('applicants')
        .select(`
          id,
          merge_applicant_id,
          applications (
            id,
            job_id,
            created_at,
            AI_summary (
              id,
              overall_summary,
              emotion_eval, 
              text_eval,
              transcript_summary
            )
          )
        `)
        .filter('merge_applicant_id', 'in', `(${mergeApplicantIds.join(',')})`);

      if (applicantsError) {
        console.error('Error fetching applicants from Supabase:', applicantsError);
        // Return just Merge data if there's an error fetching from Supabase
        return mergeApplicants.map((mergeApplicant: any) => ({
          application: mergeApplicant.application,
          candidate: mergeApplicant.candidate,
          job: mergeApplicant.job,
          interviewStages: mergeApplicant.interviewStages,
          applicant: null,
          AI_summary: null,
          hasSupabaseData: false,
          hasMergeData: true,
          hasAISummary: false
        }));
      }

      // If no applicants found in Supabase, return just Merge data
      if (!applicantsData || applicantsData.length === 0) {
        return mergeApplicants.map((mergeApplicant: any) => ({
          application: mergeApplicant.application,
          candidate: mergeApplicant.candidate,
          job: mergeApplicant.job,
          interviewStages: mergeApplicant.interviewStages,
          applicant: null,
          AI_summary: null,
          hasSupabaseData: false,
          hasMergeData: true,
          hasAISummary: false
        }));
      }

      // Flatten the data structure to match expected format
      supabaseData = applicantsData.map(applicant => ({
        id: applicant.applications?.[0]?.id,
        job_id: applicant.applications?.[0]?.job_id,
        applicant_id: applicant.id,
        created_at: applicant.applications?.[0]?.created_at,
        applicants: {
          id: applicant.id,
          merge_applicant_id: applicant.merge_applicant_id
        },
        AI_summary: applicant.applications?.[0]?.AI_summary
      }));

    } catch (supabaseError) {
      console.error('Error connecting to Supabase:', supabaseError);
      // Return just Merge data if there's a connection error
      return mergeApplicants.map((mergeApplicant: any) => ({
        application: mergeApplicant.application,
        candidate: mergeApplicant.candidate,
        job: mergeApplicant.job,
        interviewStages: mergeApplicant.interviewStages,
        applicant: null,
        AI_summary: null,
        hasSupabaseData: false,
        hasMergeData: true,
        hasAISummary: false
      }));
    }

    // Join the data
    const joinedData = supabaseData.map((application: any) => {
      // Find the corresponding Merge applicant data
      const mergeApplicant = mergeApplicants.find(
        (ma: any) => ma.application.id === application.applicants?.merge_applicant_id
      );
      
      return {
        // Supabase data
        application: {
          id: application.id,
          job_id: application.job_id,
          applicant_id: application.applicant_id,
          created_at: application.created_at,
          invitation_sent: true,
        },
        applicant: application.applicants,
        AI_summary: application.AI_summary,
        
        // Merge API data
        candidate: mergeApplicant?.candidate || null,
        job: mergeApplicant?.job || null,
        interviewStages: mergeApplicant?.interviewStages || null,
        
        // Status flags
        hasSupabaseData: !!application.applicants,
        hasMergeData: !!mergeApplicant,
        hasAISummary: !!application.AI_summary && 
          !(Array.isArray(application.AI_summary) && application.AI_summary.length === 0)
      };
    });
    
    // Also include Merge applicants that don't have Supabase data
    const mergeOnlyApplicants = mergeApplicants
      .filter((ma: any) => !supabaseData.some(
        (sd: any) => sd.applicants?.merge_applicant_id === ma.application.id
      ))
      .map((mergeApplicant: any) => ({
        application: {
          id: mergeApplicant.application.id,
          job_id: null,
          applicant_id: null,
          created_at: mergeApplicant.application.created_at,
          invitation_sent: false,
        },
        applicant: null,
        AI_summary: null,
        candidate: mergeApplicant.candidate,
        job: mergeApplicant.job,
        interviewStages: mergeApplicant.interviewStages,
        hasSupabaseData: false,
        hasMergeData: true,
        hasAISummary: false
      }));
    
    const result = [...joinedData, ...mergeOnlyApplicants];
    
    // Cache the results
    cache.set('joinedApplicantsData', result, 3600); // Cache for 1 hour
    
    return result;
  } catch (error) {
    console.error('Error in fetchJoinedApplicantsData:', error);
    
    // Try to get cached data if available
    const cachedData = cache.get('joinedApplicantsData');
    if (cachedData) {
      console.log('Returning cached applicants data');
      return cachedData;
    }
    
    throw error;
  }
}