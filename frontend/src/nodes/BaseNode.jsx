import { Handle, Position } from 'reactflow'
import { NodeField } from '@/nodes/NodeField'
import { cn } from '@/lib/utils'

function handlesOnSide(handles, side) {
  return handles.filter((handle) => handle.side === side)
}

function handleOffset(index, count) {
  return `${((index + 1) / (count + 1)) * 100}%`
}

export function BaseNode({
  id,
  data,
  selected,
  title,
  description,
  fields = [],
  handles = [],
  children,
  width = 240,
}) {
  const leftHandles = handlesOnSide(handles, 'left')
  const rightHandles = handlesOnSide(handles, 'right')

  return (
    <div
      className={cn(
        'relative rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow',
        selected ? 'ring-2 ring-indigo-500' : 'hover:shadow-md',
      )}
      style={{ width }}
    >
      {leftHandles.map((handle, index) => (
        <Handle
          key={handle.id}
          type={handle.kind}
          position={Position.Left}
          id={`${id}-${handle.id}`}
          style={{ top: handleOffset(index, leftHandles.length) }}
        />
      ))}

      <div className="border-b px-3 py-2 text-xs font-semibold">{title}</div>

      <div className="flex flex-col gap-2 px-3 py-2">
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
        {fields.map((field) => (
          <NodeField key={field.key} nodeId={id} data={data} field={field} />
        ))}
        {children}
      </div>

      {rightHandles.map((handle, index) => (
        <Handle
          key={handle.id}
          type={handle.kind}
          position={Position.Right}
          id={`${id}-${handle.id}`}
          style={{ top: handleOffset(index, rightHandles.length) }}
        />
      ))}
    </div>
  )
}
