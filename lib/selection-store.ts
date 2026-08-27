"use client"

import { useCallback, useSyncExternalStore } from "react"

export const COMPARE_LIMIT = 4

const KEYS = {
  saved: "campusfind:saved",
  compare: "campusfind:compare",
} as const

export type SelectionKind = keyof typeof KEYS

type Snapshot = Record<SelectionKind, string[]>

const EMPTY: Snapshot = { saved: [], compare: [] }

let snapshot: Snapshot = EMPTY
let hydrated = false
const listeners = new Set<() => void>()

function read(kind: SelectionKind): string[] {
  try {
    const raw = localStorage.getItem(KEYS[kind])
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : []
  } catch {
    return []
  }
}

function emit() {
  for (const listener of listeners) listener()
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return
  hydrated = true
  snapshot = { saved: read("saved"), compare: read("compare") }
  emit()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  hydrate()

  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEYS.saved && event.key !== KEYS.compare) return
    snapshot = { saved: read("saved"), compare: read("compare") }
    emit()
  }
  window.addEventListener("storage", onStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

function commit(kind: SelectionKind, ids: string[]) {
  snapshot = { ...snapshot, [kind]: ids }
  try {
    localStorage.setItem(KEYS[kind], JSON.stringify(ids))
  } catch {
    // Storage may be unavailable (private mode) — in-memory state still works.
  }
  emit()
}

/** Server render and the first client render both see the empty list, so hydration stays stable. */
const EMPTY_IDS: string[] = []

export function useSelection(kind: SelectionKind) {
  const ids = useSyncExternalStore(
    subscribe,
    () => snapshot[kind],
    () => EMPTY_IDS,
  )

  const toggle = useCallback(
    (id: string) => {
      const current = snapshot[kind]
      if (current.includes(id)) {
        commit(kind, current.filter((value) => value !== id))
        return { added: false, limitReached: false }
      }
      if (kind === "compare" && current.length >= COMPARE_LIMIT) {
        return { added: false, limitReached: true }
      }
      commit(kind, [...current, id])
      return { added: true, limitReached: false }
    },
    [kind],
  )

  const remove = useCallback(
    (id: string) => commit(kind, snapshot[kind].filter((value) => value !== id)),
    [kind],
  )

  const clear = useCallback(() => commit(kind, []), [kind])

  const has = useCallback((id: string) => ids.includes(id), [ids])

  return { ids, has, toggle, remove, clear, isFull: kind === "compare" && ids.length >= COMPARE_LIMIT }
}
