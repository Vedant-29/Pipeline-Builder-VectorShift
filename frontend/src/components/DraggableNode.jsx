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
      className="flex cursor-grab items-center gap-2 rounded-md border bg-card px-3 py-2 text-xs font-medium shadow-sm transition-colors hover:border-indigo-400 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:cursor-grabbing"
    >
      {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
      <span>{label}</span>
    </div>
  )
}
