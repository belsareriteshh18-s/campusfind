"use client"

import { memo } from "react"
import Link from "next/link"
import { BarChart3, Bookmark, Building2, Check, MapPin, Star, TrendingUp } from "lucide-react"
import { Highlight } from "@/components/highlight"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatFees, formatPlacement, formatReviews } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { College } from "@/types/college"

type Props = {
  college: College
  term?: string
  view?: "grid" | "list"
  saved: boolean
  compared: boolean
  compareDisabled?: boolean
  onSave: (id: string) => void
  onCompare: (id: string) => void
}

function CollegeCardBase({
  college,
  term = "",
  view = "grid",
  saved,
  compared,
  compareDisabled,
  onSave,
  onCompare,
}: Props) {
  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-2xl border bg-card p-4 transition-shadow hover:shadow-md",
        view === "list" && "sm:flex-row sm:items-center sm:gap-6",
      )}
    >
      <div className={cn("flex items-start justify-between gap-3", view === "list" && "sm:flex-1 sm:items-center")}>
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="grid size-11 shrink-0 place-items-center rounded-xl text-xs font-bold text-neutral-800"
            style={{ backgroundColor: college.accent }}
          >
            {college.shortName.slice(0, 4)}
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold leading-snug text-pretty">
              <Link href={`/colleges/${college.id}`} className="hover:text-primary hover:underline">
                <Highlight text={college.name} term={term} />
              </Link>
            </h3>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                <Highlight text={`${college.city}, ${college.state}`} term={term} />
              </span>
              <span aria-hidden>·</span>
              <span className="flex items-center gap-1">
                <Building2 className="size-3.5" />
                {college.type}
              </span>
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onSave(college.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${college.name} from saved` : `Save ${college.name}`}
          className="shrink-0"
        >
          <Bookmark className={cn(saved && "fill-primary text-primary")} />
        </Button>
      </div>

      <div className={cn("flex flex-wrap items-center gap-2", view === "list" && "sm:shrink-0")}>
        <Badge variant="secondary" className="gap-1">
          <Star className="size-3 fill-current text-amber-500" />
          {college.rating}
        </Badge>
        <span className="text-xs text-muted-foreground">{formatReviews(college.reviews)}</span>
        <Badge variant="outline">#{college.rank} in {college.stream}</Badge>
      </div>

      <dl className={cn("grid grid-cols-2 gap-3 text-sm", view === "list" && "sm:w-64 sm:shrink-0")}>
        <div>
          <dt className="text-xs text-muted-foreground">Annual fees</dt>
          <dd className="font-semibold tabular-nums">{formatFees(college.fees)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Avg. package</dt>
          <dd className="flex items-center gap-1 font-semibold tabular-nums">
            <TrendingUp className="size-3.5 text-primary" />
            {formatPlacement(college.placement)}
          </dd>
        </div>
      </dl>

      <div className={cn("flex items-center gap-2 border-t pt-3", view === "list" && "sm:shrink-0 sm:border-0 sm:pt-0")}>
        <Button
          variant={compared ? "secondary" : "outline"}
          size="sm"
          onClick={() => onCompare(college.id)}
          disabled={!compared && compareDisabled}
          aria-pressed={compared}
          className="flex-1"
        >
          {compared ? <Check data-icon="inline-start" /> : <BarChart3 data-icon="inline-start" />}
          {compared ? "In compare" : "Compare"}
        </Button>
        <Button variant="ghost" size="sm" nativeButton={false} render={<Link href={`/colleges/${college.id}`} />}>
          Details
        </Button>
      </div>
    </article>
  )
}

/** Memoised so typing in search doesn't re-render every untouched card. */
export const CollegeCard = memo(CollegeCardBase)
