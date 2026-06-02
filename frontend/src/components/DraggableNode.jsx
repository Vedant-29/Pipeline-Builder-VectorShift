import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

export function DraggableNode({ type, label, icon: Icon, hint }) {
  const onDragStart = (event) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ nodeType: type }),
    )
    event.dataTransfer.effectAllowed = 'move'

    const chip = event.currentTarget
    const ghost = chip.cloneNode(true)
    ghost.style.position = 'fixed'
    ghost.style.top = '-9999px'
    ghost.style.left = '-9999px'
    ghost.style.width = `${chip.offsetWidth}px`
    ghost.style.margin = '0'
    ghost.style.boxShadow = 'none'
    document.body.appendChild(ghost)
    event.dataTransfer.setDragImage(ghost, chip.offsetWidth / 2, chip.offsetHeight / 2)
    setTimeout(() => document.body.removeChild(ghost), 0)
  }

  const chip = (
    <div
      draggable
      tabIndex={0}
      onDragStart={onDragStart}
      className="flex cursor-grab items-center gap-1.5 rounded-md border border-line bg-surface px-2 py-1 text-[12px] font-medium text-ink transition-colors hover:border-line-strong hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/30 active:cursor-grabbing"
    >
      {Icon ? <Icon className="size-3.5 text-faint" strokeWidth={2} /> : null}
      <span>{label}</span>
    </div>
  )

  if (!hint) return chip

  return (
    <Tooltip>
      <TooltipTrigger asChild>{chip}</TooltipTrigger>
      <TooltipContent side="bottom">{hint}</TooltipContent>
    </Tooltip>
  )
}
