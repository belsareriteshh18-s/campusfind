"use client"

import Link from "next/link"
import { AlertTriangle, BarChart3, RotateCcw } from "lucide-react"
import { CompareTable } from "@/components/compare-table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { useAsyncResource } from "@/hooks/use-async-resource"
import { fetchCollegesByIds } from "@/lib/mock-api"
import { COMPARE_LIMIT, useSelection } from "@/lib/selection-store"
import type { College } from "@/types/college"

export function CompareView() {
  const compare = useSelection("compare")
  const key = compare.ids.join(",")

  const { data, isLoading, error, retry } = useAsyncResource<College[]>(
    (signal) => fetchCollegesByIds(compare.ids, signal),
    [key],
    { enabled: compare.ids.length > 0 },
  )

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-balance">Compare colleges</h1>
          <p className="mt-1 text-muted-foreground text-pretty">
            Side-by-side on fees, placements, selectivity, and courses. Best value in each row is highlighted.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" render={<Link href="/colleges" />}>
            Add more
          </Button>
          {compare.ids.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={compare.clear}>
              Clear all
            </Button>
          ) : null}
        </div>
      </header>

      {compare.ids.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BarChart3 />
            </EmptyMedia>
            <EmptyTitle>Nothing to compare yet</EmptyTitle>
            <EmptyDescription>
              Pick up to {COMPARE_LIMIT} colleges from search and they&apos;ll show up here side by side.
            </EmptyDescription>
          </EmptyHeader>
          <Button render={<Link href="/colleges" />}>Browse colleges</Button>
        </Empty>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>Couldn&apos;t load your comparison</AlertTitle>
          <AlertDescription>
            <p>{error.message}</p>
            <Button variant="outline" size="sm" onClick={retry} className="mt-3">
              <RotateCcw data-icon="inline-start" />
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      ) : isLoading || !data ? (
        <Skeleton className="h-96 w-full rounded-2xl" />
      ) : (
        <>
          <CompareTable colleges={data} onRemove={compare.remove} />
          {data.length === 1 ? (
            <p className="text-sm text-muted-foreground">
              Add at least one more college to see the best-value highlights.
            </p>
          ) : null}
        </>
      )}
    </div>
  )
}
