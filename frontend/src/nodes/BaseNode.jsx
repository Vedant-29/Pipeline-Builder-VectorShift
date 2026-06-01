import { Fragment } from 'react'
import { Handle, Position, NodeResizer, useReactFlow } from '@xyflow/react'
import { X } from 'lucide-react'
import { NodeField } from '@/nodes/NodeField'
import { useStore } from '@/store'
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
        'pointer-events-none absolute -translate-y-1/2 whitespace-nowrap font-mono text-[10px] tracking-tight text-faint',
        side === 'left' ? 'right-full mr-2.5' : 'left-full ml-2.5',
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
  fields = [],
  handles = [],
  children,
  width = 248,
  minWidth = 180,
  minHeight = 90,
}) {
  const { deleteElements } = useReactFlow()
  const setNodeSize = useStore((state) => state.setNodeSize)
  const edges = useStore((state) => state.edges)
  const isConnected = (handleId) =>
    edges.some(
      (edge) =>
        edge.sourceHandle === `${id}-${handleId}` ||
        edge.targetHandle === `${id}-${handleId}`,
    )
  const leftHandles = handlesOnSide(handles, 'left')
  const rightHandles = handlesOnSide(handles, 'right')

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-xl border bg-surface transition-colors',
        selected ? 'border-clay' : 'border-line hover:border-line-strong',
      )}
      style={{
        width: data?.w ?? width,
        height: data?.h ?? undefined,
        boxShadow: selected ? '0 0 0 2px rgba(194, 90, 60, 0.10)' : undefined,
      }}
    >
      <NodeResizer
        minWidth={minWidth}
        minHeight={minHeight}
        isVisible={selected}
        onResize={(_, params) => setNodeSize(id, params.width, params.height)}
        handleStyle={{
          width: 8,
          height: 8,
          borderRadius: 3,
          background: '#c25a3c',
          border: 'none',
        }}
        lineStyle={{ borderColor: 'rgba(194, 90, 60, 0.3)' }}
      />

      {leftHandles.map((handle, index) => {
        const top = handleOffset(index, leftHandles.length)
        return (
          <Fragment key={handle.id}>
            <Handle
              type={handle.kind}
              position={Position.Left}
              id={`${id}-${handle.id}`}
              style={{ top }}
            />
            {handle.label && !isConnected(handle.id) ? (
              <HandleLabel side="left" top={top}>
                {handle.label}
              </HandleLabel>
            ) : null}
          </Fragment>
        )
      })}

      <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
        {Icon ? (
          <Icon className="size-4 shrink-0 text-dim" strokeWidth={2} />
        ) : null}
        <span className="flex-1 text-[13px] font-medium text-ink">{title}</span>
        <button
          type="button"
          onClick={() => deleteElements({ nodes: [{ id }] })}
          aria-label="Delete node"
          className="nodrag flex size-5 items-center justify-center rounded text-faint opacity-0 transition-colors hover:bg-clay/10 hover:text-clay focus-visible:opacity-100 focus-visible:outline-none group-hover:opacity-100"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 px-3 py-3">
        {description ? (
          <p className="text-xs leading-relaxed text-dim">{description}</p>
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
              style={{ top }}
            />
            {handle.label && !isConnected(handle.id) ? (
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
