import { useCallback, useMemo } from 'react';
import { useCache } from './useCache';
import { getMergeHeaders, MERGE_BASE_URL } from '@/utils/api/merge';

export function useMergeApi() {
  const cache = useCache();

  const fetchMerge = useCallback(async (
    endpoint: string, 
    options?: RequestInit,
    skipCache = false
  ) => {
    const cacheKey = `merge-${endpoint}-${JSON.stringify(options)}`;
    
    if (!skipCache) {
      const cached = cache.get(cacheKey);
      if (cached) return cached;
    }

    const headers = await getMergeHeaders(undefined, options?.method === 'POST');
    const response = await fetch(`${MERGE_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers
      }
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!skipCache) {
      cache.set(cacheKey, data);
    }
    
    return data;
  }, [cache]);

  return useMemo(() => ({
    fetchMerge,
    invalidateCache: cache.invalidate
  }), [fetchMerge, cache.invalidate]);
} 