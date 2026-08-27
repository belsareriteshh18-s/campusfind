"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, BarChart3, GraduationCap, SlidersHorizontal, Sparkles } from "lucide-react"
import { CollegeCard } from "@/components/college-card"
import { SearchInput } from "@/components/search-input"
import { Button, buttonVariants } from "@/components/ui/button"
import { colleges } from "@/data/colleges"
import { useSelection } from "@/lib/selection-store"
import { cn } from "@/lib/utils"

const quickLinks = [
  { label: "Engineering", href: "/colleges?streams=Engineering&sort=rank" },
  { label: "Management", href: "/colleges?streams=Management&sort=rank" },
  { label: "Medical", href: "/colleges?streams=Medical&sort=rank" },
  { label: "Under ₹2L fees", href: "/colleges?maxFees=200000&sort=fees-asc" },
  { label: "Government only", href: "/colleges?types=Government&sort=rating" },
]

const capabilities = [
  {
    icon: Sparkles,
    title: "Type-ahead search",
    body: "Debounced queries with grouped suggestions for colleges, cities, courses, and entrance exams.",
  },
  {
    icon: SlidersHorizontal,
    title: "Faceted filters",
    body: "Stream, type, state, exam, fee ceiling, and rating filters with live result counts kept in the URL.",
  },
  {
    icon: BarChart3,
    title: "Side-by-side compare",
    body: "Shortlist up to four colleges and see the best value in every row highlighted automatically.",
  },
]

const featured = [...colleges].sort((a, b) => b.rating - a.rating).slice(0, 6)

export default function HomePage() {
  const router = useRouter()
  const saved = useSelection("saved")
  const compare = useSelection("compare")
  const [term, setTerm] = useState("")

  const submit = (value: string) => {
    const trimmed = value.trim()
    router.push(trimmed ? `/colleges?q=${encodeURIComponent(trimmed)}` : "/colleges")
  }

  return (
    <div className="flex flex-col">
      <section className="border-b bg-muted/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="mb-5 flex items-center gap-2 text-sm font-semibold text-primary">
              <GraduationCap className="size-4" />
              Make your next move count
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-6xl">
              Find a college that feels like <span className="text-primary">your place.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              Search 40+ Indian institutions, filter on the things that actually decide your choice, and compare
              shortlists side by side.
            </p>
          </div>

          <div className="flex max-w-2xl flex-col gap-3 sm:flex-row">
            <SearchInput value={term} onChange={setTerm} onSubmit={submit} className="flex-1" />
            <Button size="lg" onClick={() => submit(term)}>
              Search
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>

          <ul className="flex flex-wrap items-center gap-2">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full bg-background")}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-14">
        <ul className="grid gap-4 md:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex flex-col gap-3 rounded-2xl border bg-card p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h2 className="font-semibold">{title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-20">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Top rated right now</h2>
            <p className="mt-1 text-muted-foreground text-pretty">
              Save any college to your shortlist or add it to the comparison tray.
            </p>
          </div>
          <Link href="/colleges" className={cn(buttonVariants({ variant: "outline" }))}>
            See all colleges
            <ArrowRight data-icon="inline-end" />
          </Link>
        </header>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {featured.map((college) => (
            <CollegeCard
              key={college.id}
              college={college}
              saved={saved.has(college.id)}
              compared={compare.has(college.id)}
              compareDisabled={compare.isFull}
              onSave={saved.toggle}
              onCompare={compare.toggle}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
