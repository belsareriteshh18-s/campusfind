"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatFees } from "@/lib/format"
import { defaultQuery } from "@/lib/mock-api"
import type { SearchQuery } from "@/types/college"

type FacetKey = "types" | "streams" | "states" | "exams"

type Chip = { label: string; onRemove: () => void }

export function ActiveFilters({
  query,
  onToggleFacet,
  onUpdate,
  onReset,
}: {
  query: SearchQuery
  onToggleFacet: (key: FacetKey, value: string) => void
  onUpdate: (patch: Partial<SearchQuery>) => void
  onReset: () => void
}) {
  const chips: Chip[] = []

  const facetKeys: FacetKey[] = ["streams", "types", "exams", "states"]
  for (const key of facetKeys) {
    for (const value of query[key]) {
      chips.push({ label: value, onRemove: () => onToggleFacet(key, value) })
    }
  }
  if (query.maxFees !== defaultQuery.maxFees) {
    chips.push({
      label: `Under ${formatFees(query.maxFees)}`,
      onRemove: () => onUpdate({ maxFees: defaultQuery.maxFees }),
    })
  }
  if (query.minRating) {
    chips.push({ label: `${query.minRating}+ rating`, onRemove: () => onUpdate({ minRating: 0 }) })
  }
  if (query.hostelOnly) {
    chips.push({ label: "Hostel available", onRemove: () => onUpdate({ hostelOnly: false }) })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.label}
          type="button"
          onClick={chip.onRemove}
          className="flex items-center gap-1.5 rounded-full border bg-background py-1 pr-2 pl-3 text-xs font-medium transition-colors hover:bg-muted"
        >
          {chip.label}
          <X className="size-3 text-muted-foreground" />
          <span className="sr-only">Remove filter</span>
        </button>
      ))}
      <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
        Clear all
      </Button>
    </div>
  )
}
