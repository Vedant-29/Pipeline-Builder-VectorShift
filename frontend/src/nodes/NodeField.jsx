import { useStore } from '@/store'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
    <label className="flex flex-col gap-1">
      {field.label ? (
        <span className="text-[11px] font-medium text-muted-foreground">
          {field.label}
        </span>
      ) : null}

      {field.type === 'select' ? (
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="nodrag h-8 w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => {
              const { value: optionValue, label } = normalizeOption(option)
              return (
                <SelectItem key={optionValue} value={optionValue} className="text-xs">
                  {label}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      ) : field.type === 'textarea' ? (
        <Textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={field.placeholder}
          className="nodrag min-h-16 text-xs"
        />
      ) : (
        <Input
          type={field.type === 'number' ? 'number' : 'text'}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={field.placeholder}
          className="nodrag h-8 text-xs"
        />
      )}
    </label>
  )
}
