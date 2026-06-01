import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { useStore } from '@/store'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

function resolveDefault(field, nodeId) {
  if (typeof field.default === 'function') return field.default(nodeId)
  return field.default ?? ''
}

function normalizeOption(option) {
  if (typeof option === 'string') return { value: option, label: option }
  return option
}

function NodeSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handlePointer = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handlePointer)
    return () => document.removeEventListener('mousedown', handlePointer)
  }, [open])

  const current = options.find((option) => option.value === value)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="nodrag flex h-8 w-full items-center justify-between rounded-md border border-line bg-surface pr-2 pl-2.5 text-[13px] text-ink outline-none transition-colors hover:border-line-strong focus-visible:border-clay focus-visible:ring-2 focus-visible:ring-clay/20"
      >
        <span>{current?.label ?? value}</span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-faint transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>
      {open ? (
        <div className="nodrag nowheel absolute top-[calc(100%+4px)] left-0 z-50 w-full overflow-hidden rounded-md border border-line bg-surface py-1 shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center justify-between px-2.5 py-1.5 text-left text-[13px] transition-colors hover:bg-subtle',
                option.value === value ? 'text-ink' : 'text-dim',
              )}
            >
              {option.label}
              {option.value === value ? (
                <Check className="size-3.5 text-clay" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function NodeField({ nodeId, data, field }) {
  const updateNodeField = useStore((state) => state.updateNodeField)
  const value = data?.[field.key] ?? resolveDefault(field, nodeId)
  const setValue = (next) => updateNodeField(nodeId, field.key, next)

  return (
    <label className="flex flex-col gap-1.5">
      {field.label ? (
        <span className="text-[11px] font-medium text-faint">{field.label}</span>
      ) : null}

      {field.type === 'select' ? (
        <NodeSelect
          value={value}
          options={field.options.map(normalizeOption)}
          onChange={setValue}
        />
      ) : field.type === 'textarea' ? (
        <Textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={field.placeholder}
          className="nodrag min-h-16 resize-none text-[13px]"
        />
      ) : (
        <Input
          type={field.type === 'number' ? 'number' : 'text'}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={field.placeholder}
          className="nodrag h-8 text-[13px]"
        />
      )}
    </label>
  )
}
