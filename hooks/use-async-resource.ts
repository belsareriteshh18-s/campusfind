"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export type ResourceState<T> = {
  data: T | undefined
  /** True only on the first load, when there is nothing to show yet. */
  isLoading: boolean
  /** True on background refreshes while previous data stays on screen. */
  isValidating: boolean
  error: Error | undefined
  /** Re-runs the current request. */
  retry: () => void
}

type Options = {
  /** Skip fetching entirely (e.g. nothing selected yet). */
  enabled?: boolean
  /** Keep the last successful data visible while the next request is in flight. */
  keepPreviousData?: boolean
}

/**
 * Small SWR-style resource hook: aborts superseded requests, tracks
 * loading vs. validating separately, and exposes a retry for error states.
 */
export function useAsyncResource<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: unknown[],
  { enabled = true, keepPreviousData = true }: Options = {},
): ResourceState<T> {
  const [data, setData] = useState<T>()
  const [error, setError] = useState<Error>()
  const [isValidating, setIsValidating] = useState(false)
  const [attempt, setAttempt] = useState(0)

  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const hasData = data !== undefined

  useEffect(() => {
    if (!enabled) {
      setIsValidating(false)
      return
    }

    const controller = new AbortController()
    let active = true

    setIsValidating(true)
    setError(undefined)
    if (!keepPreviousData) setData(undefined)

    fetcherRef
      .current(controller.signal)
      .then((result) => {
        if (!active) return
        setData(result)
        setIsValidating(false)
      })
      .catch((err: unknown) => {
        if (!active || controller.signal.aborted) return
        setError(err instanceof Error ? err : new Error("Something went wrong"))
        setIsValidating(false)
      })

    return () => {
      active = false
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled, attempt, keepPreviousData])

  const retry = useCallback(() => setAttempt((value) => value + 1), [])

  return {
    data,
    isLoading: isValidating && !hasData,
    isValidating,
    error,
    retry,
  }
}
