import { getMergeHeaders, MERGE_BASE_URL } from './merge';
import { useCache } from '@/utils/hooks/useCache';
import { useCallback, useMemo } from 'react';
import type { Activity, User } from '@/types/merge';

export const ActivitiesAPI = {
  get: async (id: string) => {
    const headers = await getMergeHeaders();
    const response = await fetch(`${MERGE_BASE_URL}/activities/${id}?include_remote_data=true`, { headers });
    if (!response.ok) throw new Error(`Failed to fetch activity: ${response.statusText}`);
    return response.json();
  },

  list: async (params?: Record<string, string>) => {
    const queryParams = new URLSearchParams(params);
    const headers = await getMergeHeaders();
    const response = await fetch(`${MERGE_BASE_URL}/activities?${queryParams}`, { headers });
    if (!response.ok) throw new Error(`Failed to fetch activities: ${response.statusText}`);
    return response.json();
  },

  create: async (data: Partial<Activity>) => {
    const headers = await getMergeHeaders(undefined, true);
    const response = await fetch(`${MERGE_BASE_URL}/activities`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ model: data })
    });
    if (!response.ok) throw new Error(`Failed to create activity: ${response.statusText}`);
    return response.json();
  },

  delete: async (id: string) => {
    const headers = await getMergeHeaders();
    const response = await fetch(`${MERGE_BASE_URL}/activities/${id}`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) throw new Error(`Failed to delete activity: ${response.statusText}`);
    return response.ok;
  }
};

export interface EnrichedActivity {
  activity: Activity;
  user: User | null;
}

export function useActivities() {
  const cache = useCache();

  const getEnrichedActivity = useCallback(async (id: string): Promise<EnrichedActivity> => {
    const cacheKey = `enriched-activity-${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const activity = await ActivitiesAPI.get(id);
    const user = activity.user ? 
      await fetch(`/api/merge/users/${activity.user}`).then(r => r.json()) : 
      null;

    const enriched = { activity, user };
    cache.set(cacheKey, enriched);
    return enriched;
  }, [cache]);

  return useMemo(() => ({
    getActivity: ActivitiesAPI.get,
    listActivities: ActivitiesAPI.list,
    createActivity: ActivitiesAPI.create,
    deleteActivity: ActivitiesAPI.delete,
    getEnrichedActivity,
    invalidateCache: cache.invalidate
  }), [getEnrichedActivity, cache.invalidate]);
} 