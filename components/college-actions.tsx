"use client"

import { BarChart3, Bookmark, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { COMPARE_LIMIT, useSelection } from "@/lib/selection-store"
import { cn } from "@/lib/utils"
import type { College } from "@/types/college"

export function CollegeActions({ college }: { college: College }) {
  const saved = useSelection("saved")
  const compare = useSelection("compare")

  const isSaved = saved.has(college.id)
  const isCompared = compare.has(college.id)
  const limitReached = !isCompared && compare.isFull

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button variant={isSaved ? "secondary" : "outline"} onClick={() => saved.toggle(college.id)} aria-pressed={isSaved}>
        <Bookmark data-icon="inline-start" className={cn(isSaved && "fill-current")} />
        {isSaved ? "Saved" : "Save college"}
      </Button>

      <Button
        onClick={() => compare.toggle(college.id)}
        disabled={limitReached}
        aria-pressed={isCompared}
        variant={isCompared ? "secondary" : "default"}
      >
        {isCompared ? <Check data-icon="inline-start" /> : <BarChart3 data-icon="inline-start" />}
        {isCompared ? "Added to compare" : limitReached ? `Compare full (${COMPARE_LIMIT})` : "Add to compare"}
      </Button>
    </div>
  )
}
