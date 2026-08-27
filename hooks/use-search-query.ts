"use client"

import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { defaultQuery } from "@/lib/mock-api"
import type { SearchQuery, SortKey } from "@/types/college"

const SORTS: SortKey[] = ["relevance", "rating", "fees-asc", "fees-desc", "placement", "rank"]

const list = (value: string | null) => (value ? value.split(",").filter(Boolean) : [])

/** The URL is the single source of truth for the search state, so results are shareable and back/forward works. */
export function useSearchQuery() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const query = useMemo<SearchQuery>(() => {
    const sort = params.get("sort") as SortKey | null
    return {
      q: params.get("q") ?? "",
      types: list(params.get("types")),
      streams: list(params.get("streams")),
      states: list(params.get("states")),
      exams: list(params.get("exams")),
      maxFees: Number(params.get("maxFees")) || defaultQuery.maxFees,
      minRating: Number(params.get("minRating")) || 0,
      hostelOnly: params.get("hostel") === "1",
      sort: sort && SORTS.includes(sort) ? sort : "relevance",
      page: Math.max(1, Number(params.get("page")) || 1),
      perPage: defaultQuery.perPage,
    }
  }, [params])

  const push = useCallback(
    (next: SearchQuery) => {
      const search = new URLSearchParams()
      if (next.q) search.set("q", next.q)
      if (next.types.length) search.set("types", next.types.join(","))
      if (next.streams.length) search.set("streams", next.streams.join(","))
      if (next.states.length) search.set("states", next.states.join(","))
      if (next.exams.length) search.set("exams", next.exams.join(","))
      if (next.maxFees !== defaultQuery.maxFees) search.set("maxFees", String(next.maxFees))
      if (next.minRating) search.set("minRating", String(next.minRating))
      if (next.hostelOnly) search.set("hostel", "1")
      if (next.sort !== "relevance") search.set("sort", next.sort)
      if (next.page > 1) search.set("page", String(next.page))

      const qs = search.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router],
  )

  /** Any filter change resets pagination unless the page itself is being set. */
  const update = useCallback(
    (patch: Partial<SearchQuery>) => push({ ...query, page: 1, ...patch }),
    [push, query],
  )

  const toggleFacet = useCallback(
    (key: "types" | "streams" | "states" | "exams", value: string) => {
      const current = query[key]
      update({ [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] })
    },
    [query, update],
  )

  const reset = useCallback(() => router.replace(pathname, { scroll: false }), [pathname, router])

  const activeFilterCount =
    query.types.length +
    query.streams.length +
    query.states.length +
    query.exams.length +
    (query.maxFees !== defaultQuery.maxFees ? 1 : 0) +
    (query.minRating ? 1 : 0) +
    (query.hostelOnly ? 1 : 0)

  return { query, update, toggleFacet, reset, activeFilterCount }
}
