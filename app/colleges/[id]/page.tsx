import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ArrowLeft, Building2, CalendarDays, GraduationCap, MapPin, Star, TrendingUp, Users } from "lucide-react"
import { CollegeActions } from "@/components/college-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { colleges, getCollege } from "@/data/colleges"
import { formatFees, formatPlacement, formatReviews } from "@/lib/format"

export function generateStaticParams() {
  return colleges.map((college) => ({ id: college.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const college = getCollege(id)
  if (!college) return { title: "College not found — CampusFind" }

  return {
    title: `${college.name} — CampusFind`,
    description: college.description,
  }
}

export default async function CollegeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const college = getCollege(id)
  if (!college) notFound()

  const similar = colleges
    .filter((item) => item.id !== college.id && item.stream === college.stream)
    .slice(0, 3)

  const stats = [
    { label: "Annual fees", value: formatFees(college.fees), icon: GraduationCap },
    { label: "Average package", value: formatPlacement(college.placement), icon: TrendingUp },
    { label: "Acceptance rate", value: `${college.acceptanceRate}%`, icon: Users },
    { label: "Established", value: String(college.established), icon: CalendarDays },
  ]

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-5 py-8">
      <Button variant="ghost" size="sm" className="self-start text-muted-foreground" nativeButton={false} render={<Link href="/colleges" />}>
        <ArrowLeft data-icon="inline-start" />
        Back to search
      </Button>

      <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className="grid size-16 shrink-0 place-items-center rounded-2xl text-base font-bold text-neutral-800"
            style={{ backgroundColor: college.accent }}
          >
            {college.shortName.slice(0, 4)}
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-balance">{college.name}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {college.city}, {college.state}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="size-4" />
                {college.type}
              </span>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Star className="size-3 fill-current text-amber-500" />
                {college.rating}
              </Badge>
              <span className="text-sm text-muted-foreground">{formatReviews(college.reviews)}</span>
              <Badge variant="outline">
                #{college.rank} in {college.stream}
              </Badge>
              {college.hostel ? <Badge variant="outline">Hostel available</Badge> : null}
            </div>
          </div>
        </div>

        <CollegeActions college={college} />
      </header>

      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-2 rounded-2xl border bg-card p-4">
            <dt className="flex items-center gap-2 text-sm text-muted-foreground">
              <stat.icon className="size-4" />
              {stat.label}
            </dt>
            <dd className="text-xl font-semibold tabular-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <Separator />

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">About the college</h2>
        <p className="max-w-3xl leading-relaxed text-muted-foreground text-pretty">{college.description}</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {college.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="flex flex-col gap-3 rounded-2xl border bg-card p-5">
          <h2 className="text-lg font-semibold">Popular courses</h2>
          <ul className="flex flex-col gap-2">
            {college.courses.map((course) => (
              <li key={course} className="flex items-center justify-between gap-3 border-b pb-2 text-sm last:border-0">
                <span>{course}</span>
                <span className="text-xs text-muted-foreground">{formatFees(college.fees)}/yr</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-3 rounded-2xl border bg-card p-5">
          <h2 className="text-lg font-semibold">Admission &amp; exams</h2>
          <p className="text-sm text-muted-foreground">Accepted entrance exams for {college.stream.toLowerCase()}:</p>
          <div className="flex flex-wrap gap-2">
            {college.exams.map((exam) => (
              <Badge key={exam} variant="outline">
                {exam}
              </Badge>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Roughly {college.acceptanceRate}% of applicants receive an offer, making this a{" "}
            {college.acceptanceRate < 10 ? "highly selective" : "competitive"} choice.
          </p>
        </section>
      </div>

      {similar.length > 0 ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Similar colleges in {college.stream}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {similar.map((item) => (
              <Link
                key={item.id}
                href={`/colleges/${item.id}`}
                className="flex flex-col gap-2 rounded-2xl border bg-card p-4 transition-shadow hover:shadow-md"
              >
                <span className="font-medium leading-snug text-pretty">{item.name}</span>
                <span className="text-sm text-muted-foreground">
                  {item.city} · {formatFees(item.fees)}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Star className="size-3.5 fill-current text-amber-500" />
                  {item.rating}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
