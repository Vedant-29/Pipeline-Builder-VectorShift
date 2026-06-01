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
      onDragStart={onDragStart}
      className="flex cursor-grab items-center gap-2 rounded-md border bg-card px-3 py-2 text-xs font-medium shadow-sm transition-colors hover:border-indigo-400 hover:bg-accent active:cursor-grabbing"
    >
      {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
      <span>{label}</span>
    </div>
  )
}
