import { ChevronDown } from 'lucide-react'
import { useStore } from '@/store'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

function resolveDefault(field, nodeId) {
  if (typeof field.default === 'function') return field.default(nodeId)
  return field.default ?? ''
}

function normalizeOption(option) {
  if (typeof option === 'string') return { value: option, label: option }
  return option
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
        <div className="relative">
          <select
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="nodrag h-8 w-full appearance-none rounded-md border border-line bg-surface pr-7 pl-2.5 text-[13px] text-ink outline-none transition-colors hover:border-line-strong focus-visible:border-clay focus-visible:ring-2 focus-visible:ring-clay/20"
          >
            {field.options.map((option) => {
              const { value: optionValue, label } = normalizeOption(option)
              return (
                <option key={optionValue} value={optionValue}>
                  {label}
                </option>
              )
            })}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-faint" />
        </div>
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
