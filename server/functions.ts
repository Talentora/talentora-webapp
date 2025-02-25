import { getScouts } from '@/utils/supabase/queries';
import { getURL } from '@/utils/helpers';

// Example server-side data fetching functions
export async function fetchJobsData() {
  const response = await fetch(getURL('api/jobs'), {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'force-cache',
    next: { revalidate: 1800 }
  });
  
  if (!response.ok) {
    throw new Error(`Jobs fetch failed: ${response.status}`);
  }
  
  return response.json();
}

export async function fetchApplicationsData() {
  const response = await fetch(getURL('api/applications'), {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'force-cache',
    next: { revalidate: 1800 }
  });
  
  if (!response.ok) {
    throw new Error(`Applications fetch failed: ${response.status}`);
  }
  
  return response.json();
}

export async function fetchScoutsData() {
  return await getScouts();
}