"use client"

import Link from "next/link"
import { Check, Minus, Trophy, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatFees, formatPlacement } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { College } from "@/types/college"

type Row = {
  label: string
  render: (college: College) => React.ReactNode
  /** Numeric value used to flag the strongest option in the row. */
  value?: (college: College) => number
  best?: "max" | "min"
}

const rows: Row[] = [
  { label: "Institute type", render: (c) => c.type },
  { label: "Stream", render: (c) => c.stream },
  { label: "Location", render: (c) => `${c.city}, ${c.state}` },
  { label: "Established", render: (c) => c.established, value: (c) => c.established, best: "min" },
  {
    label: "Rating",
    render: (c) => `${c.rating} / 5`,
    value: (c) => c.rating,
    best: "max",
  },
  {
    label: "Annual fees",
    render: (c) => formatFees(c.fees),
    value: (c) => c.fees,
    best: "min",
  },
  {
    label: "Average package",
    render: (c) => formatPlacement(c.placement),
    value: (c) => c.placement,
    best: "max",
  },
  {
    label: "Stream rank",
    render: (c) => `#${c.rank}`,
    value: (c) => c.rank,
    best: "min",
  },
  {
    label: "Acceptance rate",
    render: (c) => `${c.acceptanceRate}%`,
    value: (c) => c.acceptanceRate,
    best: "min",
  },
  {
    label: "Hostel",
    render: (c) =>
      c.hostel ? (
        <span className="flex items-center gap-1 text-primary">
          <Check className="size-4" /> Available
        </span>
      ) : (
        <span className="flex items-center gap-1 text-muted-foreground">
          <Minus className="size-4" /> Not offered
        </span>
      ),
  },
  { label: "Exams accepted", render: (c) => c.exams.join(", ") },
  {
    label: "Popular courses",
    render: (c) => (
      <ul className="flex flex-col gap-1">
        {c.courses.slice(0, 3).map((course) => (
          <li key={course}>{course}</li>
        ))}
      </ul>
    ),
  },
]

export function CompareTable({
  colleges,
  onRemove,
}: {
  colleges: College[]
  onRemove: (id: string) => void
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border">
      <Table className="min-w-[640px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-40 bg-muted/40">Parameter</TableHead>
            {colleges.map((college) => (
              <TableHead key={college.id} className="min-w-52 align-top">
                <div className="flex items-start justify-between gap-2 py-3">
                  <div>
                    <Link href={`/colleges/${college.id}`} className="font-semibold text-foreground hover:underline">
                      {college.shortName}
                    </Link>
                    <p className="mt-0.5 max-w-40 text-xs font-normal text-muted-foreground text-pretty">
                      {college.name}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onRemove(college.id)}
                    aria-label={`Remove ${college.name}`}
                  >
                    <X />
                  </Button>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const values = row.value ? colleges.map(row.value) : []
            const bestValue =
              row.best && values.length > 1
                ? row.best === "max"
                  ? Math.max(...values)
                  : Math.min(...values)
                : undefined

            return (
              <TableRow key={row.label}>
                <TableCell className="bg-muted/40 align-top text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {row.label}
                </TableCell>
                {colleges.map((college, index) => {
                  const isBest = bestValue !== undefined && values[index] === bestValue
                  return (
                    <TableCell
                      key={college.id}
                      className={cn("align-top text-sm", isBest && "bg-primary/5 font-semibold")}
                    >
                      <span className="flex items-center gap-2">
                        {row.render(college)}
                        {isBest ? (
                          <Badge variant="secondary" className="gap-1">
                            <Trophy className="size-3" />
                            Best
                          </Badge>
                        ) : null}
                      </span>
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
