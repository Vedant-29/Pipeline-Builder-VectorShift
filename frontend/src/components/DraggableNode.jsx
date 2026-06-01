export function DraggableNode({ type, label, icon: Icon }) {
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
      className="flex cursor-grab items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[13px] font-medium text-ink transition-colors hover:border-line-strong hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/30 active:cursor-grabbing"
    >
      {Icon ? <Icon className="size-4 text-faint" strokeWidth={2} /> : null}
      <span>{label}</span>
    </div>
  )
}
