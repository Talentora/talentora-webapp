import { useCallback, useMemo } from 'react';
import { useCache } from '@/utils/hooks/useCache';
import { getMergeHeaders, MERGE_BASE_URL } from './merge';
import type { Candidate, Attachment } from '@/types/merge';

export const CandidatesAPI = {
  get: async (id: string) => {
    const headers = await getMergeHeaders();
    const response = await fetch(`${MERGE_BASE_URL}/candidates/${id}?include_remote_data=true`, { headers });
    if (!response.ok) throw new Error(`Failed to fetch candidate: ${response.statusText}`);
    return response.json();
  },

  list: async (params?: Record<string, string>) => {
    const queryParams = new URLSearchParams(params);
    const headers = await getMergeHeaders();
    const response = await fetch(`${MERGE_BASE_URL}/candidates?${queryParams}`, { headers });
    if (!response.ok) throw new Error(`Failed to fetch candidates: ${response.statusText}`);
    return response.json();
  }
};

export function useCandidates() {
  const cache = useCache();

  const getCandidate = useCallback(async (id: string) => {
    const cacheKey = `candidate-${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const data = await CandidatesAPI.get(id);
    cache.set(cacheKey, data);
    return data;
  }, [cache]);

  const getCandidateWithAttachments = useCallback(async (id: string) => {
    const cacheKey = `candidate-attachments-${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const [candidate, attachmentsResponse] = await Promise.all([
      CandidatesAPI.get(id),
      fetch(`/api/merge/attachments?candidate_id=${id}`).then(r => r.json())
    ]);

    const data = {
      candidate,
      attachments: attachmentsResponse.results || []
    };

    cache.set(cacheKey, data);
    return data;
  }, [cache]);

  return useMemo(() => ({
    getCandidate,
    getCandidateWithAttachments,
    invalidateCache: cache.invalidate
  }), [getCandidate, getCandidateWithAttachments, cache.invalidate]);
} 