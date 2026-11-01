"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "./api";

interface ApiState<T> {
  key: string | null;
  data?: T;
  error?: string;
}

/** Loads `fetcher()` whenever `key` changes; pass `null` to skip. */
export function useApi<T>(key: string | null, fetcher: () => Promise<T>) {
  const fetcherRef = useRef(fetcher);
  const [version, setVersion] = useState(0);
  const [state, setState] = useState<ApiState<T>>({ key: null });

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    if (key === null) return;
    let cancelled = false;
    fetcherRef
      .current()
      .then((data) => {
        if (!cancelled) setState({ key, data });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState((current) => ({
            ...current,
            key,
            error: err instanceof ApiError ? err.message : String(err),
          }));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [key, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const setData = useCallback(
    (update: (current: T | undefined) => T) =>
      setState((current) => ({ ...current, data: update(current.data) })),
    [],
  );

  const isCurrent = state.key === key;
  return {
    data: state.data,
    error: isCurrent ? state.error : undefined,
    loading: key !== null && (!isCurrent || (!state.data && !state.error)),
    reload,
    setData,
  };
}
