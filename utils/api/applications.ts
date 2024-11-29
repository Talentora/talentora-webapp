import { getMergeHeaders, MERGE_BASE_URL } from './merge';
import { useCache } from '@/utils/hooks/useCache';
import { useCallback, useMemo } from 'react';
import type { Tables } from '@/types/types_db';
import type { Application, Candidate, Job, Attachment, Interview } from '@/types/merge';
import { getAccountTokenFromApplication, getApplication } from '@/utils/supabase/queries';

// Types
export type EnrichedApplication = {
  application: Application;
  candidate: Candidate | null;
  job: Job | null;
  attachments: Attachment[];
  interviews: Interview[];
  supabaseData?: Tables<'applications'>;
};

// Cache helper
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  return cached.data as T;
}

function setCached(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

// API Functions
export const ApplicationsAPI = {
  get: async (id: string) => {
    const cacheKey = `application-${id}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const { token } = await getAccountTokenFromApplication(id);
    const headers = await getMergeHeaders(undefined, false, token);
    const response = await fetch(`${MERGE_BASE_URL}/applications/${id}?include_remote_data=true`, { headers });
    
    if (!response.ok) throw new Error(`Failed to fetch application: ${response.statusText}`);
    const data = await response.json();
    setCached(cacheKey, data);
    return data;
  },

  list: async (params?: Record<string, string>) => {
    const cacheKey = `applications-list-${JSON.stringify(params)}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const queryParams = new URLSearchParams(params);
    const headers = await getMergeHeaders();
    const response = await fetch(`${MERGE_BASE_URL}/applications?${queryParams}`, { headers });
    
    if (!response.ok) throw new Error(`Failed to fetch applications: ${response.statusText}`);
    const data = await response.json();
    setCached(cacheKey, data);
    return data;
  },

  update: async (id: string, data: Partial<Application>) => {
    const headers = await getMergeHeaders(undefined, true);
    const response = await fetch(`${MERGE_BASE_URL}/applications/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ model: data })
    });
    
    if (!response.ok) throw new Error(`Failed to update application: ${response.statusText}`);
    
    // Invalidate cache for this application
    cache.delete(`application-${id}`);
    return response.json();
  }
};

// Hook for managing application data
export function useApplications() {
  const cache = useCache();

  const getEnrichedApplication = useCallback(async (id: string): Promise<EnrichedApplication> => {
    const cacheKey = `enriched-application-${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    // Get application details from both Merge and Supabase
    const [mergeApplication, supabaseApplication] = await Promise.all([
      ApplicationsAPI.get(id),
      getApplication(id)
    ]);

    // Get candidate, job, and attachments in parallel
    const [candidate, job, attachmentsResponse, interviewsResponse] = await Promise.all([
      mergeApplication.candidate ? fetch(`/api/merge/candidates/${mergeApplication.candidate}`).then(r => r.json()) : null,
      mergeApplication.job ? fetch(`/api/merge/jobs/${mergeApplication.job}`).then(r => r.json()) : null,
      mergeApplication.candidate ? fetch(`/api/merge/attachments?candidate_id=${mergeApplication.candidate}`).then(r => r.json()) : { results: [] },
      fetch(`/api/merge/interviews?application_id=${id}`).then(r => r.json()).catch(() => ({ results: [] }))
    ]);

    const enriched = {
      application: mergeApplication,
      candidate,
      job,
      attachments: attachmentsResponse.results || [],
      interviews: interviewsResponse.results || [],
      supabaseData: supabaseApplication
    };

    cache.set(cacheKey, enriched);
    return enriched;
  }, [cache]);

  return useMemo(() => ({
    getApplication: ApplicationsAPI.get,
    getEnrichedApplication,
    listApplications: ApplicationsAPI.list,
    updateApplication: ApplicationsAPI.update,
    invalidateCache: cache.invalidate
  }), [getEnrichedApplication, cache.invalidate]);
} 