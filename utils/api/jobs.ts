import { getMergeHeaders, MERGE_BASE_URL } from './merge';
import { useCache } from '@/utils/hooks/useCache';
import { useCallback, useMemo } from 'react';
import type { Job, Department, Office } from '@/types/merge';

export const JobsAPI = {
  get: async (id: string) => {
    const headers = await getMergeHeaders();
    const response = await fetch(`${MERGE_BASE_URL}/jobs/${id}?include_remote_data=true`, { headers });
    if (!response.ok) throw new Error(`Failed to fetch job: ${response.statusText}`);
    return response.json();
  },

  list: async (params?: Record<string, string>) => {
    const queryParams = new URLSearchParams(params);
    const headers = await getMergeHeaders();
    const response = await fetch(`${MERGE_BASE_URL}/jobs?${queryParams}`, { headers });
    if (!response.ok) throw new Error(`Failed to fetch jobs: ${response.statusText}`);
    return response.json();
  }
};

export interface EnrichedJob {
  job: Job;
  departments: Department[];
  offices: Office[];
}

export function useJobs() {
  const cache = useCache();

  const getEnrichedJob = useCallback(async (id: string): Promise<EnrichedJob> => {
    const cacheKey = `enriched-job-${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const [job, departmentsResponse, officesResponse] = await Promise.all([
      JobsAPI.get(id),
      fetch(`/api/merge/departments?job_id=${id}`).then(r => r.json()),
      fetch(`/api/merge/offices?job_id=${id}`).then(r => r.json())
    ]);

    const enriched = {
      job,
      departments: departmentsResponse.results || [],
      offices: officesResponse.results || []
    };

    cache.set(cacheKey, enriched);
    return enriched;
  }, [cache]);

  return useMemo(() => ({
    getJob: JobsAPI.get,
    listJobs: JobsAPI.list,
    getEnrichedJob,
    invalidateCache: cache.invalidate
  }), [getEnrichedJob, cache.invalidate]);
} 