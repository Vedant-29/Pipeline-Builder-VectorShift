import { nodeDefs } from '@/nodes/registry'
import { DraggableNode } from '@/components/DraggableNode'

export function PipelineToolbar() {
  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-2.5">
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
