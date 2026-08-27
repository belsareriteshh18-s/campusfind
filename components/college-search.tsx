"use client"

import { useEffect, useState } from "react"
import { ActiveFilters } from "@/components/active-filters"
import { CollegeResults } from "@/components/college-results"
import { FilterPanel } from "@/components/filter-panel"
import { ResultsToolbar } from "@/components/results-toolbar"
import { SearchInput } from "@/components/search-input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useAsyncResource } from "@/hooks/use-async-resource"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useSearchQuery } from "@/hooks/use-search-query"
import { searchColleges } from "@/lib/mock-api"
import { useSelection } from "@/lib/selection-store"
import type { SearchResponse } from "@/types/college"

export function CollegeSearch() {
  const { query, update, toggleFacet, reset, activeFilterCount } = useSearchQuery()
  const saved = useSelection("saved")
  const compare = useSelection("compare")

  const [view, setView] = useState<"grid" | "list">("grid")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [term, setTerm] = useState(query.q)

  // Keep the input in sync when the query changes from outside (suggestion click, back button).
  useEffect(() => setTerm(query.q), [query.q])

  const debouncedTerm = useDebouncedValue(term, 300)

  useEffect(() => {
    if (debouncedTerm !== query.q) update({ q: debouncedTerm })
  }, [debouncedTerm, query.q, update])

  const effectiveQuery = { ...query, q: debouncedTerm }

  const { data, isLoading, isValidating, error, retry } = useAsyncResource<SearchResponse>(
    (signal) => searchColleges(effectiveQuery, signal),
    [
      effectiveQuery.q,
      effectiveQuery.types.join(","),
      effectiveQuery.streams.join(","),
      effectiveQuery.states.join(","),
      effectiveQuery.exams.join(","),
      effectiveQuery.maxFees,
      effectiveQuery.minRating,
      effectiveQuery.hostelOnly,
      effectiveQuery.sort,
      effectiveQuery.page,
    ],
  )

  const renderFilterPanel = (showHeading: boolean) => (
    <FilterPanel
      query={query}
      facets={data?.facets}
      isLoading={isLoading}
      activeFilterCount={activeFilterCount}
      onToggleFacet={toggleFacet}
      onUpdate={update}
      onReset={reset}
      showHeading={showHeading}
    />
  )

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8">
      <header className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-balance">Explore colleges</h1>
          <p className="mt-1 text-muted-foreground text-pretty">
            Search 40+ institutions, filter by what matters to you, and shortlist up to four for a side-by-side view.
          </p>
        </div>
        <SearchInput value={term} onChange={setTerm} onSubmit={(value) => update({ q: value })} className="max-w-2xl" />
        <ActiveFilters query={query} onToggleFacet={toggleFacet} onUpdate={update} onReset={reset} />
      </header>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="hidden w-64 shrink-0 rounded-2xl border bg-card p-5 lg:sticky lg:top-20 lg:block">
          {filterPanel}
        </aside>

        <section className="flex min-w-0 flex-1 flex-col gap-5">
          <ResultsToolbar
            total={data?.total}
            tookMs={data?.tookMs}
            isLoading={isLoading}
            isValidating={isValidating}
            sort={query.sort}
            view={view}
            activeFilterCount={activeFilterCount}
            onSortChange={(sort) => update({ sort })}
            onViewChange={setView}
            onOpenFilters={() => setFiltersOpen(true)}
          />

          <CollegeResults
            response={data}
            isLoading={isLoading}
            isValidating={isValidating}
            error={error}
            onRetry={retry}
            term={debouncedTerm}
            view={view}
            savedIds={saved.ids}
            comparedIds={compare.ids}
            onSave={saved.toggle}
            onCompare={compare.toggle}
            onResetFilters={reset}
            onPageChange={(page) => {
              update({ page })
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          />
        </section>
      </div>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="p-4 pb-24">{filterPanel}</div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
