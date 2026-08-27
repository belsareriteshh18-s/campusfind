import { Suspense } from "react"
import type { Metadata } from "next"
import { CollegeSearch } from "@/components/college-search"
import { Spinner } from "@/components/ui/spinner"

export const metadata: Metadata = {
  title: "Explore colleges — CampusFind",
  description: "Search and filter Indian colleges by stream, fees, ratings, entrance exams, and location.",
}

export default function CollegesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      }
    >
      <CollegeSearch />
    </Suspense>
  )
}
