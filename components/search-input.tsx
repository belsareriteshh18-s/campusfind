"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, GraduationCap, Loader2, MapPin, Search, ScrollText, X } from "lucide-react"
import { Highlight } from "@/components/highlight"
import { useAsyncResource } from "@/hooks/use-async-resource"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { fetchSuggestions } from "@/lib/mock-api"
import { cn } from "@/lib/utils"
import type { Suggestion } from "@/types/college"

const icons = {
  college: Building2,
  city: MapPin,
  course: GraduationCap,
  exam: ScrollText,
} as const

const kindLabels = {
  college: "College",
  city: "City",
  course: "Course",
  exam: "Exam",
} as const

type Props = {
  value: string
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Search colleges, cities, courses, or exams",
  className,
  autoFocus,
}: Props) {
  const router = useRouter()
  const listId = useId()
  const containerRef = useRef<HTMLDivElement>(null)

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const debounced = useDebouncedValue(value, 250)
  const term = debounced.trim()

  const { data, isValidating } = useAsyncResource<Suggestion[]>(
    (signal) => fetchSuggestions(term, signal),
    [term],
    { enabled: term.length >= 2, keepPreviousData: false },
  )

  const suggestions = term.length >= 2 ? (data ?? []) : []

  useEffect(() => setActiveIndex(-1), [term])

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [])

  const go = (suggestion: Suggestion) => {
    setOpen(false)
    router.push(suggestion.href)
  }

  const submit = () => {
    setOpen(false)
    onSubmit?.(value)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter can be confirming an IME composition rather than submitting.
    if (event.nativeEvent.isComposing || event.keyCode === 229) return

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((index) => (suggestions.length ? (index + 1) % suggestions.length : -1))
      return
    }
    if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((index) => (suggestions.length ? (index - 1 + suggestions.length) % suggestions.length : -1))
      return
    }
    if (event.key === "Escape") {
      setOpen(false)
      return
    }
    if (event.key === "Enter") {
      if (open && activeIndex >= 0 && suggestions[activeIndex]) {
        event.preventDefault()
        go(suggestions[activeIndex])
        return
      }
      submit()
    }
  }

  const showPanel = open && term.length >= 2

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="flex items-center gap-3 rounded-xl border bg-background px-4 shadow-sm focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          type="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          autoFocus={autoFocus}
          value={value}
          placeholder={placeholder}
          onChange={(event) => {
            onChange(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="h-12 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
        />
        {isValidating && term.length >= 2 ? (
          <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" aria-label="Loading suggestions" />
        ) : null}
        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange("")
              setOpen(false)
            }}
            aria-label="Clear search"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      {showPanel ? (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border bg-popover shadow-lg">
          {suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              {isValidating ? "Searching…" : `No matches for "${term}"`}
            </p>
          ) : (
            <ul id={listId} role="listbox" className="max-h-80 overflow-y-auto py-1">
              {suggestions.map((suggestion, index) => {
                const Icon = icons[suggestion.kind]
                return (
                  <li key={`${suggestion.kind}-${suggestion.label}`}>
                    <button
                      id={`${listId}-${index}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => go(suggestion)}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm",
                        index === activeIndex ? "bg-muted" : "hover:bg-muted/60",
                      )}
                    >
                      <Icon className="size-4 shrink-0 text-muted-foreground" />
                      <span className="flex-1 truncate">
                        <Highlight text={suggestion.label} term={term} />
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">{kindLabels[suggestion.kind]}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  )
}
