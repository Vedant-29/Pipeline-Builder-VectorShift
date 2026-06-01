import { useEffect, useMemo, useRef, useState } from 'react'
import { nodeDefs } from '@/nodes/registry'
import { cn } from '@/lib/utils'

export function CommandPalette({ open, onClose, onPick }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return nodeDefs
    return nodeDefs.filter(
      (def) =>
        def.label.toLowerCase().includes(q) ||
        def.type.toLowerCase().includes(q),
    )
  }, [query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      const id = window.setTimeout(() => inputRef.current?.focus(), 0)
      return () => window.clearTimeout(id)
    }
  }, [open])

  useEffect(() => {
    setActive(0)
  }, [query])

  if (!open) return null

  const choose = (def) => {
    if (!def) return
    onPick(def.type)
    onClose()
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((value) => Math.min(value + 1, results.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((value) => Math.max(value - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      choose(results[active])
    } else if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/20 pt-[18vh]"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl border border-line bg-surface shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Add a node…"
          className="w-full border-b border-line bg-transparent px-4 py-3 text-sm text-ink outline-none placeholder:text-faint"
        />
        <div className="max-h-72 overflow-y-auto p-1">
          {results.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-faint">
              No nodes found
            </div>
          ) : (
            results.map((def, index) => {
              const Icon = def.icon
              return (
                <button
                  key={def.type}
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(def)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors',
                    index === active ? 'bg-subtle text-ink' : 'text-dim',
                  )}
                >
                  {Icon ? (
                    <Icon className="size-4 text-faint" strokeWidth={2} />
                  ) : null}
                  <span>{def.label}</span>
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
