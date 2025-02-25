import { getURL } from '@/utils/helpers';
import { getMergeApiKey } from '@/utils/supabase/queries';

const API_URL = process.env.NEXT_PUBLIC_DATABASE_URL;

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