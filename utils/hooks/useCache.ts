import { useRef, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

export function useCache<T>(expirationTime = 5 * 60 * 1000) { // Default 5 minutes
  const cache = useRef<Map<string, CacheEntry<T>>>(new Map());

  const get = useCallback((key: string): T | null => {
    const entry = cache.current.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.expiresIn) {
      cache.current.delete(key);
      return null;
    }

    return entry.data;
  }, []);

  const set = useCallback((key: string, data: T, customExpiration?: number) => {
    cache.current.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn: customExpiration || expirationTime
    });
  }, [expirationTime]);

  const invalidate = useCallback((key: string) => {
    cache.current.delete(key);
  }, []);

  return { get, set, invalidate };
} 