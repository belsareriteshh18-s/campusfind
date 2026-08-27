"use client"

import { LayoutGrid, List, SlidersHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { SORT_LABELS } from "@/lib/format"
import type { SearchQuery, SortKey } from "@/types/college"

const sortKeys: SortKey[] = ["relevance", "rating", "fees-asc", "fees-desc", "placement", "rank"]

type Props = {
  total: number | undefined
  tookMs: number | undefined
  isLoading: boolean
  isValidating: boolean
  sort: SortKey
  view: "grid" | "list"
  activeFilterCount: number
  onSortChange: (sort: SortKey) => void
  onViewChange: (view: "grid" | "list") => void
  onOpenFilters: () => void
}

export function ResultsToolbar({
  total,
  tookMs,
  isLoading,
  isValidating,
  sort,
  view,
  activeFilterCount,
  onSortChange,
  onViewChange,
  onOpenFilters,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
        {isLoading || total === undefined ? (
          <Skeleton className="h-4 w-40" />
        ) : (
          <span>
            <span className="font-semibold text-foreground tabular-nums">{total}</span>{" "}
            {total === 1 ? "college" : "colleges"} found
            {tookMs !== undefined ? <span className="ml-1 tabular-nums">in {tookMs}ms</span> : null}
            {isValidating ? <span className="ml-2 text-xs">updating…</span> : null}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onOpenFilters} className="lg:hidden">
          <SlidersHorizontal data-icon="inline-start" />
          Filters
          {activeFilterCount > 0 ? <Badge variant="secondary">{activeFilterCount}</Badge> : null}
        </Button>

        <Select value={sort} onValueChange={(value) => onSortChange(value as SortKey)}>
          <SelectTrigger size="sm" className="w-44" aria-label="Sort results">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {sortKeys.map((key) => (
                <SelectItem key={key} value={key}>
                  {SORT_LABELS[key]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <ToggleGroup
          value={[view]}
          onValueChange={(value) => {
            const next = value[0]
            if (next === "grid" || next === "list") onViewChange(next)
          }}
          variant="outline"
          size="sm"
          className="hidden sm:flex"
        >
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGrid />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  )
}
