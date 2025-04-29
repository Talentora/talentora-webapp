import { getURL } from '@/utils/helpers';
import { getMergeApiKey } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/client';

const API_URL = process.env.NEXT_PUBLIC_DATABASE_URL;


export async function fetchApplicationData(mergeApplicationId: string) {
    const response = await fetch(getURL(`api/application/${mergeApplicationId}`), {
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



  export async function fetchAllApplications() {
    const accountToken = await getMergeApiKey();
    if (!accountToken) {
      throw new Error('Account token not found');
    }

    const params = new URLSearchParams({
      account_token: accountToken,
      add_AI_summary: "true"
    });

    const response = await fetch(`${API_URL}/merge/applications?${params.toString()}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      // cache: 'force-cache',
      // next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      throw new Error(`Applications fetch failed: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data;
  }


  export async function fetchApplicationsByJobId(jobId: string) {
    const accountToken = await getMergeApiKey();
    if (!accountToken) {
      throw new Error('Account token not found');
    }

    const params = new URLSearchParams({
      account_token: accountToken,
      add_AI_summary: "true"
    });

    const response = await fetch(`${API_URL}/merge/applications/job/${jobId}?${params.toString()}`, {
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

    const result = await response.json();
    return result.data;
  }


  export async function fetchRecentApplications() {
    const accountToken = await getMergeApiKey();
    if (!accountToken) {
      throw new Error('Account token not found');
    }
    const supabase = createClient();
    const { data: applications, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      throw new Error('Error fetching applications');
    }

    return applications;
  }
  

  export async function getApplicationCount(jobId: string) {
    const accountToken = await getMergeApiKey();
    if (!accountToken) {
      throw new Error('Account token not found');
    }
    const supabase = createClient();
    const { data, count, error } = await supabase
    .from('applications')
    .select('*', { count: 'exact' })
    .eq('job_id', jobId);

    return count || 0;
  }



  // input is merge jobID and merge candidateID
  export async function fetchApplicationMergeId(jobId: string, candidateId: string) {
    const accountToken = await getMergeApiKey();

    if (!accountToken) {
        throw new Error('Account token not found');
    }

    const params = new URLSearchParams({
        account_token: accountToken
    });
    
    const url = `${API_URL}/merge/application-id/${jobId}/${candidateId}?${params.toString()}`;
    
    const response = await fetch(url, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        cache: 'no-store'
    });
    
    if (!response.ok) {
        throw new Error(`Failed to fetch application ID: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data.application_id;
}