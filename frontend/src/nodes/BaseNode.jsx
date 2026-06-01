import { Fragment } from 'react'
import { Handle, Position, useReactFlow } from '@xyflow/react'
import { X } from 'lucide-react'
import { NodeField } from '@/nodes/NodeField'
import { cn } from '@/lib/utils'

function handlesOnSide(handles, side) {
  return handles.filter((handle) => handle.side === side)
}

function handleOffset(index, count) {
  return `${((index + 1) / (count + 1)) * 100}%`
}

function HandleLabel({ side, top, children }) {
  return (
    <span
      className={cn(
        'pointer-events-none absolute -translate-y-1/2 whitespace-nowrap rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-500 shadow-xs ring-1 ring-slate-200/70',
        side === 'left' ? 'right-full mr-2' : 'left-full ml-2',
      )}
      style={{ top }}
    >
      {children}
    </span>
  )
}

export function BaseNode({
  id,
  data,
  selected,
  title,
  description,
  icon: Icon,
  accent = '#6366f1',
  fields = [],
  handles = [],
  children,
  width = 250,
}) {
  const { deleteElements } = useReactFlow()
  const leftHandles = handlesOnSide(handles, 'left')
  const rightHandles = handlesOnSide(handles, 'right')

  return (
    <div
      className={cn(
        'group relative rounded-xl border border-slate-200 bg-white transition-shadow',
        selected ? '' : 'shadow-sm hover:shadow',
      )}
      style={{
        width,
        '--node-accent': accent,
        boxShadow: selected
          ? `0 0 0 1.5px ${accent}, 0 2px 10px -4px rgba(15, 23, 42, 0.12)`
          : undefined,
      }}
    >
      {leftHandles.map((handle, index) => {
        const top = handleOffset(index, leftHandles.length)
        return (
          <Fragment key={handle.id}>
            <Handle
              type={handle.kind}
              position={Position.Left}
              id={`${id}-${handle.id}`}
              style={{ top, background: accent }}
            />
            {handle.label ? (
              <HandleLabel side="left" top={top}>
                {handle.label}
              </HandleLabel>
            ) : null}
          </Fragment>
        )
      })}

      <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5">
        {Icon ? (
          <span
            className="flex size-6 shrink-0 items-center justify-center rounded-md"
            style={{ backgroundColor: `${accent}1a`, color: accent }}
          >
            <Icon className="size-3.5" strokeWidth={2.25} />
          </span>
        ) : null}
        <span className="flex-1 text-[13px] font-semibold text-slate-800">
          {title}
        </span>
        <button
          type="button"
          onClick={() => deleteElements({ nodes: [{ id }] })}
          aria-label="Delete node"
          className="nodrag flex size-5 items-center justify-center rounded text-slate-400 opacity-0 transition-colors hover:bg-red-50 hover:text-red-500 focus-visible:opacity-100 focus-visible:outline-none group-hover:opacity-100"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <div className="flex flex-col gap-3 px-3 py-3">
        {description ? (
          <p className="text-xs leading-relaxed text-slate-500">{description}</p>
        ) : null}
        {fields.map((field) => (
          <NodeField key={field.key} nodeId={id} data={data} field={field} />
        ))}
        {children}
      </div>

      {rightHandles.map((handle, index) => {
        const top = handleOffset(index, rightHandles.length)
        return (
          <Fragment key={handle.id}>
            <Handle
              type={handle.kind}
              position={Position.Right}
              id={`${id}-${handle.id}`}
              style={{ top, background: accent }}
            />
            {handle.label ? (
              <HandleLabel side="right" top={top}>
                {handle.label}
              </HandleLabel>
            ) : null}
          </Fragment>
        )
      })}
    </div>
  )
}
