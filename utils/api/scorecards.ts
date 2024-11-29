import { getMergeHeaders, MERGE_BASE_URL } from './merge';
import { useCache } from '@/utils/hooks/useCache';
import { useCallback, useMemo } from 'react';
import type { Scorecard, Interview } from '@/types/merge';

export const ScorecardsAPI = {
  get: async (id: string) => {
    const headers = await getMergeHeaders();
    const response = await fetch(`${MERGE_BASE_URL}/scorecards/${id}?include_remote_data=true`, { headers });
    if (!response.ok) throw new Error(`Failed to fetch scorecard: ${response.statusText}`);
    return response.json();
  },

  list: async (params?: {
    application_id?: string;
    interview_id?: string;
    interviewer_id?: string;
    created_after?: string;
    created_before?: string;
    cursor?: string;
    expand?: string;
    include_remote_data?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }
    const headers = await getMergeHeaders();
    const response = await fetch(`${MERGE_BASE_URL}/scorecards?${queryParams}`, { headers });
    if (!response.ok) throw new Error(`Failed to fetch scorecards: ${response.statusText}`);
    return response.json();
  },

  create: async (data: Partial<Scorecard>) => {
    const headers = await getMergeHeaders(undefined, true);
    const response = await fetch(`${MERGE_BASE_URL}/scorecards`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ model: data })
    });
    if (!response.ok) throw new Error(`Failed to create scorecard: ${response.statusText}`);
    return response.json();
  }
};

export interface EnrichedScorecard {
  scorecard: Scorecard;
  interview: Interview | null;
}

export function useScorecard() {
  const cache = useCache();

  const getEnrichedScorecard = useCallback(async (id: string): Promise<EnrichedScorecard> => {
    const cacheKey = `enriched-scorecard-${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const scorecard = await ScorecardsAPI.get(id);
    const interview = scorecard.interview ? 
      await fetch(`/api/merge/interviews/${scorecard.interview}`).then(r => r.json()) : 
      null;

    const enriched = { scorecard, interview };
    cache.set(cacheKey, enriched);
    return enriched;
  }, [cache]);

  return useMemo(() => ({
    getScorecard: ScorecardsAPI.get,
    listScorecards: ScorecardsAPI.list,
    createScorecard: ScorecardsAPI.create,
    getEnrichedScorecard,
    invalidateCache: cache.invalidate
  }), [getEnrichedScorecard, cache.invalidate]);
} 