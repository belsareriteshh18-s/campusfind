"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, X } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { getColleges } from "@/data/colleges"
import { COMPARE_LIMIT, useSelection } from "@/lib/selection-store"
import { cn } from "@/lib/utils"

/** Persistent shortlist bar so the comparison flow is always one click away. */
export function CompareTray() {
  const pathname = usePathname()
  const compare = useSelection("compare")

  if (compare.ids.length === 0 || pathname === "/compare") return null

  const selected = getColleges(compare.ids)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-3 sm:p-4">
      <div className="pointer-events-auto mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl border bg-popover/95 p-3 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:gap-4 sm:p-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <BarChart3 className="size-4 text-primary" />
          <span className="tabular-nums">
            {selected.length} of {COMPARE_LIMIT} selected
          </span>
        </div>

        <ul className="flex flex-1 flex-wrap gap-2">
          {selected.map((college) => (
            <li key={college.id}>
              <span className="flex items-center gap-1.5 rounded-full border bg-background py-1 pr-1.5 pl-3 text-xs font-medium">
                {college.shortName}
                <button
                  type="button"
                  onClick={() => compare.remove(college.id)}
                  aria-label={`Remove ${college.name} from comparison`}
                  className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              </span>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={compare.clear}>
            Clear
          </Button>
          <Link href="/compare" className={cn(buttonVariants({ size: "sm" }))}>
            Compare {selected.length > 1 ? `${selected.length} colleges` : "now"}
          </Link>
        </div>
      </div>
    </div>
  )
}
