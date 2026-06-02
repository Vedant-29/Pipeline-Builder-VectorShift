import { nodeDefs } from '@/nodes/registry'
import { DraggableNode } from '@/components/DraggableNode'

const NODE_HINTS = {
  customInput: 'Feed a value into the pipeline',
  llm: 'Run a prompt through a language model',
  customOutput: 'Expose a pipeline result',
  text: 'Compose text with {{ variables }}',
  math: 'Compute a numeric operation',
  filter: 'Keep values that match a condition',
  api: 'Call an external HTTP endpoint',
  note: 'Annotate the canvas',
  conditional: 'Branch on a true / false expression',
}

export function PipelineToolbar() {
  return (
    <div className="px-4 py-3">
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
            hint={NODE_HINTS[def.type]}
          />
        ))}
      </div>
    </div>
  )
}
