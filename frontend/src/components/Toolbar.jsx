import { nodeDefs } from '@/nodes/registry'
import { DraggableNode } from '@/components/DraggableNode'

export function PipelineToolbar() {
  return (
    <div className="border-b border-slate-200 bg-white px-5 py-3">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
        Drag a node onto the canvas
      </p>
      <div className="flex flex-wrap gap-2">
        {nodeDefs.map((def) => (
          <DraggableNode
            key={def.type}
            type={def.type}
            label={def.label}
            icon={def.icon}
            accent={def.accent}
          />
        ))}
      </div>
    </div>
  )
}
