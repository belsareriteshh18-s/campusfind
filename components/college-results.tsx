"use client"

import { AlertTriangle, RotateCcw, SearchX } from "lucide-react"
import { CollegeCard } from "@/components/college-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { COMPARE_LIMIT } from "@/lib/selection-store"
import { cn } from "@/lib/utils"
import type { College, SearchResponse } from "@/types/college"

type Props = {
  response: SearchResponse | undefined
  isLoading: boolean
  isValidating: boolean
  error: Error | undefined
  onRetry: () => void
  term: string
  view: "grid" | "list"
  savedIds: string[]
  comparedIds: string[]
  onSave: (id: string) => void
  onCompare: (id: string) => void
  onResetFilters: () => void
  onPageChange: (page: number) => void
}

export function CollegeResults({
  response,
  isLoading,
  isValidating,
  error,
  onRetry,
  term,
  view,
  savedIds,
  comparedIds,
  onSave,
  onCompare,
  onResetFilters,
  onPageChange,
}: Props) {
  if (error && !response) {
    return (
      <Alert variant="destructive">
        <AlertTriangle />
        <AlertTitle>We couldn&apos;t load colleges</AlertTitle>
        <AlertDescription>
          <p>{error.message}</p>
          <Button variant="outline" size="sm" onClick={onRetry} className="mt-3">
            <RotateCcw data-icon="inline-start" />
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (isLoading || !response) {
    return <ResultsSkeleton view={view} />
  }

  if (response.items.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX />
          </EmptyMedia>
          <EmptyTitle>No colleges match these filters</EmptyTitle>
          <EmptyDescription>
            {term ? `Nothing found for "${term}". ` : ""}
            Try widening the fee range, removing a stream, or clearing all filters.
          </EmptyDescription>
        </EmptyHeader>
        <Button variant="outline" size="sm" onClick={onResetFilters}>
          <RotateCcw data-icon="inline-start" />
          Clear all filters
        </Button>
      </Empty>
    )
  }

  const compareFull = comparedIds.length >= COMPARE_LIMIT

  return (
    <div className="flex flex-col gap-5">
      {/* Stale results stay interactive but dim while the next page loads. */}
      <div
        className={cn(
          "grid gap-4 transition-opacity",
          isValidating && "opacity-60",
          view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
        )}
      >
        {response.items.map((college: College) => (
          <CollegeCard
            key={college.id}
            college={college}
            term={term}
            view={view}
            saved={savedIds.includes(college.id)}
            compared={comparedIds.includes(college.id)}
            compareDisabled={compareFull}
            onSave={onSave}
            onCompare={onCompare}
          />
        ))}
      </div>

      {error ? (
        <p className="text-sm text-destructive">
          Couldn&apos;t refresh results — showing the last successful response.{" "}
          <button type="button" onClick={onRetry} className="underline">
            Retry
          </button>
        </p>
      ) : null}

      {response.pageCount > 1 ? (
        <nav aria-label="Pagination" className="flex items-center justify-between gap-3 border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={response.page <= 1}
            onClick={() => onPageChange(response.page - 1)}
          >
            Previous
          </Button>
          <p className="text-sm text-muted-foreground tabular-nums">
            Page {response.page} of {response.pageCount}
          </p>
          <Button
            variant="outline"
            size="sm"
            disabled={response.page >= response.pageCount}
            onClick={() => onPageChange(response.page + 1)}
          >
            Next
          </Button>
        </nav>
      ) : null}
    </div>
  )
}

function ResultsSkeleton({ view }: { view: "grid" | "list" }) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading colleges"
      className={cn("grid gap-4", view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-4 rounded-2xl border bg-card p-4">
          <div className="flex items-start gap-3">
            <Skeleton className="size-11 rounded-xl" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-3/5" />
            </div>
          </div>
          <Skeleton className="h-5 w-24 rounded-full" />
          <div className="flex gap-3">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 flex-1" />
          </div>
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  )
}
