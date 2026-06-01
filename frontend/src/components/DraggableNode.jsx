export function DraggableNode({ type, label, icon: Icon, accent = '#6366f1' }) {
  const onDragStart = (event) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ nodeType: type }),
    )
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      draggable
      tabIndex={0}
      onDragStart={onDragStart}
      className="flex cursor-grab items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 active:translate-y-0 active:cursor-grabbing"
    >
      {Icon ? (
        <span
          className="flex size-5 items-center justify-center rounded"
          style={{ backgroundColor: `${accent}1a`, color: accent }}
        >
          <Icon className="size-3.5" strokeWidth={2.25} />
        </span>
      ) : null}
      <span>{label}</span>
    </div>
  )
}
