import { useCallback, useMemo } from 'react';
import { Applications, getEnrichedApplication, getEnrichedApplications } from '@/utils/api/applications';
import { useCache } from './useCache';

export function useApplications() {
  const cache = useCache();

  const getApplication = useCallback(async (id: string) => {
    const cacheKey = `application-${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const data = await Applications.get(id);
    cache.set(cacheKey, data);
    return data;
  }, [cache]);

  const getEnriched = useCallback(async (id: string) => {
    const cacheKey = `enriched-application-${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const data = await getEnrichedApplication(id);
    cache.set(cacheKey, data);
    return data;
  }, [cache]);

  const listApplications = useCallback(async (params?: any) => {
    const cacheKey = `applications-list-${JSON.stringify(params)}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const data = await Applications.list(params);
    cache.set(cacheKey, data);
    return data;
  }, [cache]);

  return useMemo(() => ({
    getApplication,
    getEnriched,
    listApplications,
    invalidateCache: cache.invalidate
  }), [getApplication, getEnriched, listApplications, cache.invalidate]);
} 