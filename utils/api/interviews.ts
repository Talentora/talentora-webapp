import { getMergeHeaders, MERGE_BASE_URL } from './merge';
import { useCache } from '@/utils/hooks/useCache';
import { useCallback, useMemo } from 'react';
import type { Interview, Scorecard } from '@/types/merge';

export const InterviewsAPI = {
  get: async (id: string) => {
    const headers = await getMergeHeaders();
    const response = await fetch(`${MERGE_BASE_URL}/interviews/${id}?include_remote_data=true`, { headers });
    if (!response.ok) throw new Error(`Failed to fetch interview: ${response.statusText}`);
    return response.json();
  },

  list: async (params?: Record<string, string>) => {
    const queryParams = new URLSearchParams(params);
    const headers = await getMergeHeaders();
    const response = await fetch(`${MERGE_BASE_URL}/interviews?${queryParams}`, { headers });
    if (!response.ok) throw new Error(`Failed to fetch interviews: ${response.statusText}`);
    return response.json();
  }
};

export interface EnrichedInterview {
  interview: Interview;
  scorecards: Scorecard[];
}

export function useInterviews() {
  const cache = useCache();

  const getEnrichedInterview = useCallback(async (id: string): Promise<EnrichedInterview> => {
    const cacheKey = `enriched-interview-${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const [interview, scorecardsResponse] = await Promise.all([
      InterviewsAPI.get(id),
      fetch(`/api/merge/scorecards?interview_id=${id}`).then(r => r.json())
    ]);

    const enriched = {
      interview,
      scorecards: scorecardsResponse.results || []
    };

    cache.set(cacheKey, enriched);
    return enriched;
  }, [cache]);

  return useMemo(() => ({
    getInterview: InterviewsAPI.get,
    listInterviews: InterviewsAPI.list,
    getEnrichedInterview,
    invalidateCache: cache.invalidate
  }), [getEnrichedInterview, cache.invalidate]);
} 