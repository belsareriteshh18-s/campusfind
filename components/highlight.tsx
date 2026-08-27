const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/** Shows users exactly why a result matched their query. */
export function Highlight({ text, term }: { text: string; term: string }) {
  const needle = term.trim()
  if (!needle) return <>{text}</>

  const parts = text.split(new RegExp(`(${escape(needle)})`, "ig"))
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === needle.toLowerCase() ? (
          <mark key={index} className="rounded bg-primary/15 px-0.5 text-foreground">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}
