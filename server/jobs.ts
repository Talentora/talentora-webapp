import { getURL } from '@/utils/helpers';
import { getMergeApiKey, fetchJobTokenById } from '@/utils/supabase/queries';

const API_URL = process.env.NEXT_PUBLIC_DATABASE_URL;

// Fetch jobs data
export async function fetchJobsData() {
  const response = await fetch(getURL('api/jobs'), {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    // cache: 'force-cache',
    // next: { revalidate: 3600 }
  });
  
  if (!response.ok) {
    throw new Error(`Jobs fetch failed: ${response.status}`);
  }
  
  return response.json();
}


// fetch jobs by id
export async function fetchJobById(jobId: string) {
    const {accountToken} = await fetchJobTokenById(jobId);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (accountToken) {
      headers['X-Account-Token'] = accountToken;
    }

    const response = await fetch(getURL(`api/jobs/${jobId}`), {
      credentials: 'include',
      headers,
      // cache: 'force-cache',
      // next: { revalidate: 3600 }
    });

    if (!response.ok) {
        throw new Error(`Job fetch failed: ${response.status}`);
    }
    
    return response.json();
  }

// fetch job configuration data, and the job. JobID is merge job id
export async function fetchJobConfigurationData(jobId: string) {
   const accountToken = await getMergeApiKey();

      if (!accountToken) {
          throw new Error('Account token not found');
      }
      
      const params = new URLSearchParams({
          account_token: accountToken,
      });
      const url = `${API_URL}/merge/job/${jobId}?${params.toString()}`;
  
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'force-cache',
        next: { revalidate: 3600 }
      });
      
      if (!response.ok) {
        throw new Error(`Jobs fetch failed: ${response.status}`);
      }
      
      return response.json();
}

