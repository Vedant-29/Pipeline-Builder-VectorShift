import { useEffect, useMemo, useState } from 'react'
import { useUpdateNodeInternals } from '@xyflow/react'
import { Type } from 'lucide-react'
import { useStore } from '@/store'
import { BaseNode } from '@/nodes/BaseNode'
import { useAutoSize, AUTOSIZE_TEXTAREA_CLASS } from '@/nodes/useAutoSize'
import { cn } from '@/lib/utils'

function extractVariables(text) {
  const pattern = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g
  const variables = []
  const seen = new Set()
  let match
  while ((match = pattern.exec(text)) !== null) {
    const name = match[1]
    if (!seen.has(name)) {
      seen.add(name)
      variables.push(name)
    }
  }
  return variables
}

export function TextNode({ id, data, selected }) {
  const updateNodeField = useStore((state) => state.updateNodeField)
  const updateNodeInternals = useUpdateNodeInternals()
  const [text, setText] = useState(data?.text ?? '{{input}}')
  const resized = data?.w != null
  const { textareaRef, width } = useAutoSize(text, !resized)

  const variables = useMemo(() => extractVariables(text), [text])

  const handles = useMemo(() => {
    const variableHandles = variables.map((name) => ({
      id: `var-${name}`,
      kind: 'target',
      side: 'left',
      label: name,
    }))
    return [...variableHandles, { id: 'output', kind: 'source', side: 'right' }]
  }, [variables])

  useEffect(() => {
    updateNodeInternals(id)
  }, [id, handles, width, data?.w, data?.h, updateNodeInternals])

  const onChange = (event) => {
    const next = event.target.value
    setText(next)
    updateNodeField(id, 'text', next)
  }

  return (
    <BaseNode
      id={id}
      data={data}
      selected={selected}
      title="Text"
      icon={Type}
      handles={handles}
      width={width}
      minWidth={200}
      minHeight={120}
    >
      <label className={cn('flex flex-col gap-1.5', resized && 'min-h-0 flex-1')}>
        <span className="text-[11px] font-medium text-faint">Text</span>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={onChange}
          rows={1}
          spellCheck={false}
          className={cn(
            AUTOSIZE_TEXTAREA_CLASS,
            resized && 'min-h-0 flex-1 overflow-auto',
          )}
        />
      </label>
    </BaseNode>
  )
}
