import { useRef } from 'react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

const PREVIEW_OFFSET_X = 14
const PREVIEW_OFFSET_Y = 12

export function DraggableNode({ type, label, icon: Icon, hint }) {
  const previewRef = useRef(null)

  const positionPreview = (x, y) => {
    const preview = previewRef.current
    if (preview) {
      preview.style.transform = `translate(${x + PREVIEW_OFFSET_X}px, ${y + PREVIEW_OFFSET_Y}px)`
    }
  }

  const onDragStart = (event) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ nodeType: type }),
    )
    event.dataTransfer.effectAllowed = 'move'

    const blank = document.createElement('div')
    blank.style.cssText =
      'position:fixed;top:-10px;left:-10px;width:1px;height:1px;opacity:0;'
    document.body.appendChild(blank)
    event.dataTransfer.setDragImage(blank, 0, 0)
    setTimeout(() => blank.remove(), 0)

    const preview = document.createElement('div')
    preview.className = 'vs-node-preview'
    const icon = event.currentTarget.querySelector('svg')
    if (icon) preview.appendChild(icon.cloneNode(true))
    const text = document.createElement('span')
    text.textContent = label
    preview.appendChild(text)
    document.body.appendChild(preview)
    previewRef.current = preview
    positionPreview(event.clientX, event.clientY)
  }

  const onDrag = (event) => {
    if (event.clientX || event.clientY) {
      positionPreview(event.clientX, event.clientY)
    }
  }

  const onDragEnd = () => {
    previewRef.current?.remove()
    previewRef.current = null
  }

  const chip = (
    <div
      draggable
      tabIndex={0}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
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
