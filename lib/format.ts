export function formatFees(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)}L`
  if (value >= 1000) return `₹${Math.round(value / 1000)}K`
  return `₹${value}`
}

export function formatPlacement(value: number) {
  return `₹${value.toFixed(1)} LPA`
}

export function formatReviews(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k reviews` : `${value} reviews`
}

export const SORT_LABELS: Record<string, string> = {
  relevance: "Best match",
  rating: "Highest rated",
  "fees-asc": "Fees: low to high",
  "fees-desc": "Fees: high to low",
  placement: "Best placements",
  rank: "Stream rank",
}
