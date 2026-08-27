"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Bookmark, Compass, Menu } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useSelection } from "@/lib/selection-store"
import { cn } from "@/lib/utils"

const links = [
  { href: "/colleges", label: "Explore" },
  { href: "/compare", label: "Compare", kind: "compare" as const },
  { href: "/saved", label: "Saved", kind: "saved" as const },
]

export function SiteHeader() {
  const pathname = usePathname()
  const saved = useSelection("saved")
  const compare = useSelection("compare")

  const counts = { saved: saved.ids.length, compare: compare.ids.length }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Compass className="size-5" />
          </span>
          <span className="text-lg">CampusFind</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                pathname.startsWith(link.href) && "bg-muted text-foreground",
              )}
            >
              {link.label}
              {link.kind && counts[link.kind] > 0 ? (
                <Badge variant="secondary" className="tabular-nums">
                  {counts[link.kind]}
                </Badge>
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/colleges"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden md:inline-flex")}
          >
            Start searching
          </Link>

          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon" className="md:hidden" aria-label="Open navigation">
                  <Menu />
                </Button>
              }
            />
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>CampusFind</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted"
                  >
                    <span className="flex items-center gap-2">
                      {link.kind === "compare" ? <BarChart3 className="size-4" /> : null}
                      {link.kind === "saved" ? <Bookmark className="size-4" /> : null}
                      {link.label}
                    </span>
                    {link.kind && counts[link.kind] > 0 ? (
                      <Badge variant="secondary">{counts[link.kind]}</Badge>
                    ) : null}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
