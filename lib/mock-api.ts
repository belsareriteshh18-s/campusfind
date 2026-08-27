import { colleges } from "@/data/colleges"
import type { College, Facet, SearchQuery, SearchResponse, Suggestion } from "@/types/college"

export class ApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ApiError"
  }
}

export const defaultQuery: SearchQuery = {
  q: "",
  types: [],
  streams: [],
  states: [],
  exams: [],
  maxFees: 1500000,
  minRating: 0,
  hostelOnly: false,
  sort: "relevance",
  page: 1,
  perPage: 9,
}

/** Simulated network latency + failure rate, so loading and error states are real. */
const LATENCY = [280, 620] as const
const FAILURE_RATE = 0.06

function delay(signal?: AbortSignal) {
  const ms = LATENCY[0] + Math.random() * (LATENCY[1] - LATENCY[0])
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException("Aborted", "AbortError"))
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer)
        reject(new DOMException("Aborted", "AbortError"))
      },
      { once: true },
    )
  })
}

function haystack(college: College) {
  return [college.name, college.shortName, college.city, college.state, college.stream, ...college.courses, ...college.exams]
    .join(" ")
    .toLowerCase()
}

/** Cheap relevance score: exact-ish name matches rank above course/city matches. */
function score(college: College, q: string) {
  if (!q) return college.rating * 2 + college.placement / 10
  const term = q.toLowerCase()
  let value = 0
  if (college.name.toLowerCase().startsWith(term)) value += 60
  if (college.shortName.toLowerCase().startsWith(term)) value += 55
  if (college.name.toLowerCase().includes(term)) value += 30
  if (college.city.toLowerCase().includes(term)) value += 18
  if (college.courses.some((c) => c.toLowerCase().includes(term))) value += 14
  if (college.exams.some((e) => e.toLowerCase().includes(term))) value += 10
  return value + college.rating * 2
}

type Predicates = Omit<SearchQuery, "sort" | "page" | "perPage">

function matches(college: College, query: Predicates, skip?: keyof Predicates) {
  if (skip !== "q" && query.q && !haystack(college).includes(query.q.toLowerCase())) return false
  if (skip !== "types" && query.types.length && !query.types.includes(college.type)) return false
  if (skip !== "streams" && query.streams.length && !query.streams.includes(college.stream)) return false
  if (skip !== "states" && query.states.length && !query.states.includes(college.state)) return false
  if (skip !== "exams" && query.exams.length && !college.exams.some((e) => query.exams.includes(e))) return false
  if (skip !== "maxFees" && college.fees > query.maxFees) return false
  if (skip !== "minRating" && college.rating < query.minRating) return false
  if (skip !== "hostelOnly" && query.hostelOnly && !college.hostel) return false
  return true
}

/** Facet counts exclude their own dimension so users can widen a filter without dead ends. */
function facetsFor(query: Predicates, dimension: keyof Predicates, pick: (c: College) => string[]): Facet[] {
  const counts = new Map<string, number>()
  for (const college of colleges) {
    if (!matches(college, query, dimension)) continue
    for (const value of pick(college)) counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return Array.from(counts, ([value, count]) => ({ value, count })).sort(
    (a, b) => b.count - a.count || a.value.localeCompare(b.value),
  )
}

const comparators: Record<SearchQuery["sort"], (a: College, b: College) => number> = {
  relevance: () => 0,
  rating: (a, b) => b.rating - a.rating,
  "fees-asc": (a, b) => a.fees - b.fees,
  "fees-desc": (a, b) => b.fees - a.fees,
  placement: (a, b) => b.placement - a.placement,
  rank: (a, b) => a.rank - b.rank,
}

export async function searchColleges(query: SearchQuery, signal?: AbortSignal): Promise<SearchResponse> {
  const startedAt = Date.now()
  await delay(signal)

  if (Math.random() < FAILURE_RATE) {
    throw new ApiError("The college service is temporarily unavailable.")
  }

  const filtered = colleges.filter((college) => matches(college, query))

  const sorted =
    query.sort === "relevance"
      ? filtered.sort((a, b) => score(b, query.q) - score(a, query.q))
      : filtered.sort(comparators[query.sort])

  const perPage = query.perPage
  const pageCount = Math.max(1, Math.ceil(sorted.length / perPage))
  const page = Math.min(Math.max(1, query.page), pageCount)

  return {
    items: sorted.slice((page - 1) * perPage, page * perPage),
    total: sorted.length,
    page,
    perPage,
    pageCount,
    facets: {
      types: facetsFor(query, "types", (c) => [c.type]),
      streams: facetsFor(query, "streams", (c) => [c.stream]),
      states: facetsFor(query, "states", (c) => [c.state]),
      exams: facetsFor(query, "exams", (c) => c.exams),
    },
    tookMs: Date.now() - startedAt,
  }
}

export async function fetchSuggestions(term: string, signal?: AbortSignal): Promise<Suggestion[]> {
  await delay(signal)
  const q = term.trim().toLowerCase()
  if (!q) return []

  const seen = new Set<string>()
  const out: Suggestion[] = []
  const push = (suggestion: Suggestion) => {
    const key = `${suggestion.kind}:${suggestion.label}`
    if (seen.has(key) || out.length >= 7) return
    seen.add(key)
    out.push(suggestion)
  }

  for (const college of colleges) {
    if (college.name.toLowerCase().includes(q) || college.shortName.toLowerCase().includes(q)) {
      push({ label: college.name, kind: "college", href: `/colleges/${college.id}` })
    }
  }
  for (const college of colleges) {
    if (college.city.toLowerCase().includes(q)) {
      push({ label: college.city, kind: "city", href: `/colleges?q=${encodeURIComponent(college.city)}` })
    }
    for (const course of college.courses) {
      if (course.toLowerCase().includes(q)) {
        push({ label: course, kind: "course", href: `/colleges?q=${encodeURIComponent(course)}` })
      }
    }
    for (const exam of college.exams) {
      if (exam.toLowerCase().includes(q)) {
        push({ label: exam, kind: "exam", href: `/colleges?q=${encodeURIComponent(exam)}` })
      }
    }
  }
  return out
}

export async function fetchCollegesByIds(ids: string[], signal?: AbortSignal): Promise<College[]> {
  await delay(signal)
  return ids
    .map((id) => colleges.find((college) => college.id === id))
    .filter((college): college is College => Boolean(college))
}
