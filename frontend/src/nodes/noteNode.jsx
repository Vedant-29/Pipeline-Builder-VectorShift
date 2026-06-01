import { useEffect, useState } from 'react'
import { useUpdateNodeInternals } from '@xyflow/react'
import { StickyNote } from 'lucide-react'
import { useStore } from '@/store'
import { BaseNode } from '@/nodes/BaseNode'
import { useAutoSize, AUTOSIZE_TEXTAREA_CLASS } from '@/nodes/useAutoSize'

export function NoteNode({ id, data, selected }) {
  const updateNodeField = useStore((state) => state.updateNodeField)
  const updateNodeInternals = useUpdateNodeInternals()
  const [note, setNote] = useState(data?.note ?? '')
  const { textareaRef, width } = useAutoSize(note)

  useEffect(() => {
    updateNodeInternals(id)
  }, [id, width, updateNodeInternals])

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
    >
      <textarea
        ref={textareaRef}
        value={note}
        onChange={onChange}
        rows={1}
        spellCheck={false}
        placeholder="Write a note..."
        className={AUTOSIZE_TEXTAREA_CLASS}
      />
    </BaseNode>
  )
}
