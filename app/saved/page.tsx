import type { Metadata } from "next"
import { SavedView } from "@/components/saved-view"

export const metadata: Metadata = {
  title: "Saved colleges — CampusFind",
  description: "Your shortlisted Indian colleges, saved on this device for quick access.",
}

export default function SavedPage() {
  return <SavedView />
}
