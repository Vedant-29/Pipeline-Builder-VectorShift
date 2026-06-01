import { nodeDefs } from '@/nodes/registry'
import { DraggableNode } from '@/components/DraggableNode'

export function PipelineToolbar() {
  return (
    <div className="rounded-xl border border-line bg-canvas px-4 py-3">
      <p className="mb-2.5 text-[11px] font-medium text-faint">
        Drag a node onto the canvas
      </p>
      <div className="flex flex-wrap gap-1.5">
        {nodeDefs.map((def) => (
          <DraggableNode
            key={def.type}
            type={def.type}
            label={def.label}
            icon={def.icon}
          />
        ))}
      </div>
    </div>
  )
}
