 import { useState, useEffect, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  enabled?: boolean;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

const memoryCache = new MemoryCache();

/**
 * Custom hook for caching data with TTL support
 * @param key - Unique cache key
 * @param fetcher - Function to fetch data if not cached
 * @param options - Cache options
 * @returns Cached data, loading state, and refetch function
 */
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const { ttl = 5 * 60 * 1000, enabled = true } = options;

  const [data, setData] = useState<T | null>(() => {
    if (!enabled) return null;
    return memoryCache.get<T>(key);
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      memoryCache.set(key, result, ttl);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [key, fetcher, ttl, enabled]);

  useEffect(() => {
    if (enabled && !data && !memoryCache.has(key)) {
      fetchData();
    }
  }, [enabled, data, key, fetchData]);

  const refetch = useCallback(async () => {
    memoryCache.delete(key);
    await fetchData();
  }, [key, fetchData]);

  return { data, isLoading, error, refetch };
}

/**
 * Hook for managing cache operations
 * @returns Cache management functions
 */
export function useCacheManager() {
  const clearCache = useCallback(() => {
    memoryCache.clear();
  }, []);

  const invalidateKey = useCallback((key: string) => {
    memoryCache.delete(key);
  }, []);

  const getCacheSize = useCallback(() => {
    // Note: This is a simple implementation. In a real app,
    // you might want to expose cache size from MemoryCache
    return 0;
  }, []);

  return {
    clearCache,
    invalidateKey,
    getCacheSize,
  };
}
