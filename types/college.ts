export type CollegeType = "Government" | "Private" | "Deemed"

export type Stream = "Engineering" | "Management" | "Medical" | "Law & Arts"

export type College = {
  id: string
  name: string
  shortName: string
  city: string
  state: string
  type: CollegeType
  stream: Stream
  established: number
  rating: number
  reviews: number
  /** Total annual fees in INR */
  fees: number
  /** Average placement package in LPA */
  placement: number
  /** National rank within the stream */
  rank: number
  acceptanceRate: number
  hostel: boolean
  exams: string[]
  courses: string[]
  tags: string[]
  description: string
  accent: string
}

export type SortKey = "relevance" | "rating" | "fees-asc" | "fees-desc" | "placement" | "rank"

export type SearchQuery = {
  q: string
  types: string[]
  streams: string[]
  states: string[]
  exams: string[]
  maxFees: number
  minRating: number
  hostelOnly: boolean
  sort: SortKey
  page: number
  perPage: number
}

export type Facet = { value: string; count: number }

export type SearchResponse = {
  items: College[]
  total: number
  page: number
  perPage: number
  pageCount: number
  facets: {
    types: Facet[]
    streams: Facet[]
    states: Facet[]
    exams: Facet[]
  }
  tookMs: number
}

export type Suggestion = {
  label: string
  kind: "college" | "city" | "course" | "exam"
  href: string
}
