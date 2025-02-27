import { getURL } from '@/utils/helpers';
import { getMergeApiKey } from '@/utils/supabase/queries';

const API_URL = process.env.NEXT_PUBLIC_DATABASE_URL;

// Fetch jobs data
export async function fetchJobsData() {
  const response = await fetch(getURL('api/jobs'), {
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

// fetch jobs by id
export async function fetchJobById(jobId: string) {
    const response = await fetch(getURL(`api/jobs/${jobId}`), {
      credentials: 'include',
      headers: { 
        'Content-Type': 'application/json' 
      },
      cache: 'force-cache',
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
        throw new Error(`Job fetch failed: ${response.status}`);
    }
    
    return response.json();
  }



// fetch job configuration data, and the job. Job ID is merge job id
export async function fetchJobConfigurationData(jobId: string) {
    console.log("reaches here")
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