"use client"

import Link from "next/link"
import { AlertTriangle, Bookmark, RotateCcw } from "lucide-react"
import { CollegeCard } from "@/components/college-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { useAsyncResource } from "@/hooks/use-async-resource"
import { fetchCollegesByIds } from "@/lib/mock-api"
import { useSelection } from "@/lib/selection-store"
import type { College } from "@/types/college"

export function SavedView() {
  const saved = useSelection("saved")
  const compare = useSelection("compare")
  const key = saved.ids.join(",")

  const { data, isLoading, error, retry } = useAsyncResource<College[]>(
    (signal) => fetchCollegesByIds(saved.ids, signal),
    [key],
    { enabled: saved.ids.length > 0 },
  )

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-balance">Saved colleges</h1>
          <p className="mt-1 text-muted-foreground text-pretty">
            Your shortlist is stored on this device, so it survives refreshes and new tabs.
          </p>
        </div>
        {saved.ids.length > 0 ? (
          <Button variant="ghost" size="sm" onClick={saved.clear}>
            Clear all
          </Button>
        ) : null}
      </header>

      {saved.ids.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Bookmark />
            </EmptyMedia>
            <EmptyTitle>No saved colleges yet</EmptyTitle>
            <EmptyDescription>
              Tap the bookmark icon on any college to keep it here for later.
            </EmptyDescription>
          </EmptyHeader>
          <Button nativeButton={false} render={<Link href="/colleges" />}>Browse colleges</Button>
        </Empty>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>Couldn&apos;t load your shortlist</AlertTitle>
          <AlertDescription>
            <p>{error.message}</p>
            <Button variant="outline" size="sm" onClick={retry} className="mt-3">
              <RotateCcw data-icon="inline-start" />
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      ) : isLoading || !data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: Math.min(saved.ids.length, 6) }).map((_, index) => (
            <Skeleton key={index} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((college) => (
            <CollegeCard
              key={college.id}
              college={college}
              saved
              compared={compare.has(college.id)}
              compareDisabled={compare.isFull}
              onSave={saved.toggle}
              onCompare={compare.toggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}
