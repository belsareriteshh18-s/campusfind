import type { Metadata } from "next"
import { CompareView } from "@/components/compare-view"

export const metadata: Metadata = {
  title: "Compare colleges — CampusFind",
  description: "Compare up to four Indian colleges side by side on fees, placements, selectivity, and courses.",
}

export default function ComparePage() {
  return <CompareView />
}
