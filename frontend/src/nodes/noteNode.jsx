import { useEffect, useState } from 'react'
import { useUpdateNodeInternals } from '@xyflow/react'
import { StickyNote } from 'lucide-react'
import { useStore } from '@/store'
import { BaseNode } from '@/nodes/BaseNode'
import { useAutoSize, AUTOSIZE_TEXTAREA_CLASS } from '@/nodes/useAutoSize'
import { cn } from '@/lib/utils'

export function NoteNode({ id, data, selected }) {
  const updateNodeField = useStore((state) => state.updateNodeField)
  const updateNodeInternals = useUpdateNodeInternals()
  const [note, setNote] = useState(data?.note ?? '')
  const resized = data?.w != null
  const { textareaRef, width } = useAutoSize(note, !resized)

  useEffect(() => {
    updateNodeInternals(id)
  }, [id, width, data?.w, data?.h, updateNodeInternals])

  const onChange = (event) => {
    const next = event.target.value
    setNote(next)
    updateNodeField(id, 'note', next)
  }

  return (
    <BaseNode
      id={id}
      data={data}
      selected={selected}
      title="Note"
      icon={StickyNote}
      handles={[]}
      width={width}
      minWidth={200}
      minHeight={120}
      autoMinHeight={false}
    >
      <textarea
        ref={textareaRef}
        value={note}
        onChange={onChange}
        rows={1}
        spellCheck={false}
        placeholder="Write a note..."
        className={cn(
          AUTOSIZE_TEXTAREA_CLASS,
          resized && 'min-h-0 flex-1 overflow-auto',
        )}
      />
    </BaseNode>
  )
}
