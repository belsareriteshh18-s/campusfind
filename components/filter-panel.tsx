"use client"

import { useState } from "react"
import { RotateCcw, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { formatFees } from "@/lib/format"
import { defaultQuery } from "@/lib/mock-api"
import { cn } from "@/lib/utils"
import type { Facet, SearchQuery, SearchResponse } from "@/types/college"

type FacetKey = "streams" | "types" | "states" | "exams"

type Props = {
  query: SearchQuery
  facets: SearchResponse["facets"] | undefined
  isLoading: boolean
  activeFilterCount: number
  onToggleFacet: (key: FacetKey, value: string) => void
  onUpdate: (patch: Partial<SearchQuery>) => void
  onReset: () => void
}

const ratingOptions = [0, 4, 4.5, 4.8]

export function FilterPanel({
  query,
  facets,
  isLoading,
  activeFilterCount,
  onToggleFacet,
  onUpdate,
  onReset,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          Filters
          {activeFilterCount > 0 ? <Badge variant="secondary">{activeFilterCount}</Badge> : null}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={activeFilterCount === 0}
          className="text-muted-foreground"
        >
          <RotateCcw data-icon="inline-start" />
          Reset
        </Button>
      </div>

      <FacetGroup
        label="Stream"
        facetKey="streams"
        options={facets?.streams}
        selected={query.streams}
        isLoading={isLoading}
        onToggle={onToggleFacet}
      />

      <Separator />

      <FacetGroup
        label="Institute type"
        facetKey="types"
        options={facets?.types}
        selected={query.types}
        isLoading={isLoading}
        onToggle={onToggleFacet}
      />

      <Separator />

      <FeeFilter value={query.maxFees} onChange={(maxFees) => onUpdate({ maxFees })} />

      <Separator />

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Minimum rating
        </legend>
        <div className="flex flex-wrap gap-2">
          {ratingOptions.map((rating) => (
            <button
              key={rating}
              type="button"
              aria-pressed={query.minRating === rating}
              onClick={() => onUpdate({ minRating: rating })}
              className={cn(
                "flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                query.minRating === rating
                  ? "border-primary bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {rating === 0 ? (
                "Any"
              ) : (
                <>
                  <Star className="size-3 fill-current text-amber-500" />
                  {rating}+
                </>
              )}
            </button>
          ))}
        </div>
      </fieldset>

      <Separator />

      <FacetGroup
        label="Entrance exam"
        facetKey="exams"
        options={facets?.exams}
        selected={query.exams}
        isLoading={isLoading}
        onToggle={onToggleFacet}
      />

      <Separator />

      <FacetGroup
        label="State"
        facetKey="states"
        options={facets?.states}
        selected={query.states}
        isLoading={isLoading}
        onToggle={onToggleFacet}
        collapsibleAfter={6}
      />

      <Separator />

      <label className="group/field flex cursor-pointer items-center justify-between gap-3 text-sm">
        <span>
          Hostel available
          <span className="block text-xs text-muted-foreground">Only show colleges with on-campus housing</span>
        </span>
        <Checkbox
          checked={query.hostelOnly}
          onCheckedChange={(checked) => onUpdate({ hostelOnly: Boolean(checked) })}
        />
      </label>
    </div>
  )
}

function FacetGroup({
  label,
  facetKey,
  options,
  selected,
  isLoading,
  onToggle,
  collapsibleAfter,
}: {
  label: string
  facetKey: FacetKey
  options: Facet[] | undefined
  selected: string[]
  isLoading: boolean
  onToggle: (key: FacetKey, value: string) => void
  collapsibleAfter?: number
}) {
  const [expanded, setExpanded] = useState(false)

  if (isLoading && !options) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-24" />
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
      </div>
    )
  }

  const all = options ?? []
  const visible = collapsibleAfter && !expanded ? all.slice(0, collapsibleAfter) : all

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</legend>

      {visible.map((option) => {
        const checked = selected.includes(option.value)
        return (
          <label
            key={option.value}
            className="group/field flex cursor-pointer items-center gap-3 text-sm has-disabled:cursor-not-allowed"
          >
            <Checkbox checked={checked} onCheckedChange={() => onToggle(facetKey, option.value)} />
            <span className={cn("flex-1 truncate", checked && "font-medium")}>{option.value}</span>
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{option.count}</span>
          </label>
        )
      })}

      {/* Selected values with zero remaining matches still need a way out. */}
      {selected
        .filter((value) => !all.some((option) => option.value === value))
        .map((value) => (
          <label key={value} className="group/field flex cursor-pointer items-center gap-3 text-sm">
            <Checkbox checked onCheckedChange={() => onToggle(facetKey, value)} />
            <span className="flex-1 truncate font-medium">{value}</span>
            <span className="shrink-0 text-xs text-muted-foreground">0</span>
          </label>
        ))}

      {collapsibleAfter && all.length > collapsibleAfter ? (
        <Button variant="link" size="sm" className="self-start px-0" onClick={() => setExpanded((value) => !value)}>
          {expanded ? "Show less" : `Show all ${all.length}`}
        </Button>
      ) : null}
    </fieldset>
  )
}

function FeeFilter({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  // Local state keeps the slider smooth; the URL/API only update on release.
  const [draft, setDraft] = useState(value)
  const current = draft

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Maximum annual fees
      </legend>
      <Slider
        min={10000}
        max={defaultQuery.maxFees}
        step={10000}
        value={current}
        onValueChange={(next) => setDraft(typeof next === "number" ? next : next[0])}
        onValueCommitted={(next) => onChange(typeof next === "number" ? next : next[0])}
        aria-label="Maximum annual fees"
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>₹10K</span>
        <span className="font-medium text-foreground tabular-nums">Up to {formatFees(current)}</span>
        <span>₹15L</span>
      </div>
    </fieldset>
  )
}
