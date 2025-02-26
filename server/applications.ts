import { getURL } from '@/utils/helpers';
import { getMergeApiKey } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/client';

const API_URL = process.env.NEXT_PUBLIC_DATABASE_URL;

// Improve cache TTL and add cache invalidation strategy
const CACHE_TTL = {
  SHORT: 300,    // 5 minutes
  MEDIUM: 1800,  // 30 minutes
  LONG: 7200     // 2 hours
};

// Enhanced cache implementation with better invalidation
const cache = {
  data: new Map<string, any>(),
  lastFetchTime: new Map<string, number>(),
  
  set(key: string, value: any, ttlSeconds: number = CACHE_TTL.MEDIUM): void {
    const expiryTime = Date.now() + (ttlSeconds * 1000);
    this.data.set(key, { value, expiryTime });
    this.lastFetchTime.set(key, Date.now());
    console.log(`Cache set: ${key} (expires in ${ttlSeconds}s)`);
  },
  
  get(key: string): any {
    const item = this.data.get(key);
    if (!item) {
      console.log(`Cache miss: ${key}`);
      return null;
    }
    
    if (Date.now() > item.expiryTime) {
      console.log(`Cache expired: ${key}`);
      this.data.delete(key);
      return null;
    }
    
    console.log(`Cache hit: ${key}`);
    return item.value;
  },
  
  invalidate(keyPattern: string): void {
    const keysToDelete: string[] = [];
    
    this.data.forEach((_, key) => {
      if (key.includes(keyPattern)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => {
      this.data.delete(key);
      console.log(`Cache invalidated: ${key}`);
    });
  },
  
  clear(): void {
    this.data.clear();
    this.lastFetchTime.clear();
    console.log('Cache cleared');
  },
  
  // Check if we should refresh the cache (even if not expired)
  shouldRefresh(key: string, refreshIntervalSeconds: number = 60): boolean {
    const lastFetch = this.lastFetchTime.get(key);
    if (!lastFetch) return true;
    
    const timeSinceLastFetch = (Date.now() - lastFetch) / 1000;
    return timeSinceLastFetch > refreshIntervalSeconds;
  }
};

// Update fetchApplicationsData to use improved caching
export async function fetchApplicationsData() {
  const cacheKey = 'applications_data';
  
  // Try to get from cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData && !cache.shouldRefresh(cacheKey)) {
    return cachedData;
  }
  
  try {
    // If cache is still valid but we should refresh in background
    const shouldBackgroundRefresh = cachedData && cache.shouldRefresh(cacheKey);
    
    const fetchPromise = fetch(getURL('api/applications'), {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'force-cache',
      next: { revalidate: 3600 }
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Applications fetch failed: ${response.status}`);
      }
      return response.json();
    }).then(data => {
      // Update cache with fresh data
      cache.set(cacheKey, data, CACHE_TTL.MEDIUM);
      return data;
    });
    
    // If we're doing a background refresh, return cached data immediately
    if (shouldBackgroundRefresh) {
      fetchPromise.catch(err => console.error('Background refresh failed:', err));
      return cachedData;
    }
    
    // Otherwise wait for the fetch to complete
    return await fetchPromise;
  } catch (error) {
    console.error('Error fetching applications data:', error);
    
    // If we have cached data, return it even if it's stale
    if (cachedData) {
      console.log('Returning stale cached data due to fetch error');
      return cachedData;
    }
    
    throw error;
  }
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

// Update fetchAllEnrichedApplicants with improved caching
export async function fetchAllEnrichedApplicants() {
  const cacheKey = 'allEnrichedApplicants';
  
  // Try to get from cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData && !cache.shouldRefresh(cacheKey)) {
    return cachedData;
  }
  
  try {
    // If cache is still valid but we should refresh in background
    const shouldBackgroundRefresh = cachedData && cache.shouldRefresh(cacheKey);
    
    const fetchPromise = async () => {
      // Get Merge API data for all applicants first
      const mergeApplicants = await fetchApplicationsData();
      
      // Try to get Supabase data
      let supabaseData: any[] = [];
      try {
        const supabase = createClient();
        
        // Get all applicants with their applications and AI summaries
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
                transcript_summary,
                resume_analysis,
                recording_id,
                batch-processor_transcript_id
              )
            )
          `);

        if (applicantsError) {
          console.error('Error fetching applicants from Supabase:', applicantsError);
        } else {
          supabaseData = applicantsData;
        }
      } catch (supabaseError) {
        console.error('Error connecting to Supabase:', supabaseError);
      }
      
      // Join the data
      const result = mergeApplicants.map((mergeApplicant: any) => {
        // Find matching Supabase data
        const matchingSupabaseData = supabaseData.find(
          data => data.merge_applicant_id === mergeApplicant.application.id
        );
        
        if (matchingSupabaseData) {
          // We have both Merge and Supabase data
          return {
            // Supabase data
            application: {
              id: matchingSupabaseData.applications?.[0]?.id,
              job_id: matchingSupabaseData.applications?.[0]?.job_id,
              applicant_id: matchingSupabaseData.id,
              created_at: matchingSupabaseData.applications?.[0]?.created_at,
              invitation_sent: true,
            },
            applicant: {
              id: matchingSupabaseData.id,
              merge_applicant_id: matchingSupabaseData.merge_applicant_id
            },
            AI_summary: matchingSupabaseData.applications?.[0]?.AI_summary,
            
            // Merge API data
            candidate: mergeApplicant.candidate,
            job: mergeApplicant.job,
            interviewStages: mergeApplicant.interviewStages,
            
            // Status flags
            hasSupabaseData: true,
            hasMergeData: true,
            hasAISummary: !!matchingSupabaseData.applications?.[0]?.AI_summary && 
              !(Array.isArray(matchingSupabaseData.applications?.[0]?.AI_summary) && 
                matchingSupabaseData.applications?.[0]?.AI_summary.length === 0)
          };
        } else {
          // We only have Merge data
          return {
            // Merge API data
            application: mergeApplicant.application,
            candidate: mergeApplicant.candidate,
            job: mergeApplicant.job,
            interviewStages: mergeApplicant.interviewStages,
            
            // Empty Supabase data
            applicant: null,
            AI_summary: null,
            
            // Status flags
            hasSupabaseData: false,
            hasMergeData: true,
            hasAISummary: false
          };
        }
      });
      
      // Cache the results
      cache.set(cacheKey, result, CACHE_TTL.MEDIUM);
      
      return result;
    };
    
    // If we're doing a background refresh, return cached data immediately
    if (shouldBackgroundRefresh) {
      fetchPromise().catch(err => console.error('Background refresh failed:', err));
      return cachedData;
    }
    
    // Otherwise wait for the fetch to complete
    return await fetchPromise();
  } catch (error) {
    console.error('Error in fetchAllEnrichedApplicants:', error);
    
    // If we have cached data, return it even if it's stale
    if (cachedData) {
      console.log('Returning stale cached data due to fetch error');
      return cachedData;
    }
    
    throw error;
  }
}

// Function to fetch a single applicant with joined data from Supabase and Merge API based on merge id
export async function fetchEnrichedApplicantByMergeId(mergeApplicationId: string) {
  try {
    // Check cache first
    const cachedData = cache.get(`enrichedApplicant_${mergeApplicationId}`);
    if (cachedData) {
      console.log('Returning cached enriched applicant data');
      return cachedData;
    }
    
    // Get Merge API data for the applicant
    const mergeApplicant = await fetchApplicationData(mergeApplicationId);
    
    // Try to get Supabase data
    let supabaseData: any = null;
    try {
      const supabase = createClient();
      
      // Get the application matching the merge ID with its related applicant and AI summary
      const { data: applicantData, error: applicantError } = await supabase
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
              transcript_summary,
              recording_id,
              batch-processor_transcript_id
            )
          )
        `)
        .eq('merge_applicant_id', mergeApplicationId)
        .single();

      console.log("applejuice applicantData", applicantData);

      if (applicantError) {
        console.error('Error fetching applicant from Supabase:', applicantError);
        // Return just Merge data if there's an error fetching from Supabase
        return {
          application: mergeApplicant.application,
          candidate: mergeApplicant.candidate,
          job: mergeApplicant.job,
          interviewStages: mergeApplicant.interviewStages,
          applicant: null,
          AI_summary: null,
          hasSupabaseData: false,
          hasMergeData: true,
          hasAISummary: false
        };
      }

      // Flatten the data structure to match expected format
      supabaseData = {
        id: applicantData?.applications?.[0]?.id,
        job_id: applicantData?.applications?.[0]?.job_id,
        applicant_id: applicantData?.id,
        created_at: applicantData?.applications?.[0]?.created_at,
        applicants: {
          id: applicantData?.id,
          merge_applicant_id: applicantData?.merge_applicant_id
        },
        AI_summary: applicantData?.applications?.[0]?.AI_summary
      };

    } catch (supabaseError) {
      console.error('Error connecting to Supabase:', supabaseError);
      // Return just Merge data if there's a connection error
      return {
        application: mergeApplicant.application,
        candidate: mergeApplicant.candidate,
        job: mergeApplicant.job,
        interviewStages: mergeApplicant.interviewStages,
        applicant: null,
        AI_summary: null,
        hasSupabaseData: false,
        hasMergeData: true,
        hasAISummary: false
      };
    }

    // Join the data
    const joinedData = {
      // Supabase data
      application: {
        id: supabaseData.id,
        job_id: supabaseData.job_id,
        applicant_id: supabaseData.applicant_id,
        created_at: supabaseData.created_at,
        invitation_sent: true,
      },
      applicant: supabaseData.applicants,
      AI_summary: supabaseData.AI_summary,
      
      // Merge API data
      candidate: mergeApplicant.candidate,
      job: mergeApplicant.job,
      interviewStages: mergeApplicant.interviewStages,
      
      // Status flags
      hasSupabaseData: !!supabaseData.applicants,
      hasMergeData: !!mergeApplicant,
      hasAISummary: !!supabaseData.AI_summary && 
        !(Array.isArray(supabaseData.AI_summary) && supabaseData.AI_summary.length === 0)
    };
    
    // Cache the result
    cache.set(`enrichedApplicant_${mergeApplicationId}`, joinedData, 3600); // Cache for 1 hour
    
    return joinedData;
  } catch (error) {
    console.error('Error in fetchEnrichedApplicantByMergeId:', error);
    
    // Try to get cached data if available
    const cachedData = cache.get(`enrichedApplicant_${mergeApplicationId}`);
    if (cachedData) {
      console.log('Returning cached enriched applicant data');
      return cachedData;
    }
    
    throw error;
  }
}