import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useUpdateNodeInternals } from 'reactflow'
import { useStore } from '@/store'
import { BaseNode } from '@/nodes/BaseNode'

const VARIABLE_PATTERN = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g
const MIN_WIDTH = 220
const MAX_WIDTH = 440
const MIN_BODY_HEIGHT = 44
const MAX_BODY_HEIGHT = 320

function extractVariables(text) {
  const variables = []
  const seen = new Set()
  let match
  VARIABLE_PATTERN.lastIndex = 0
  while ((match = VARIABLE_PATTERN.exec(text)) !== null) {
    const name = match[1]
    if (!seen.has(name)) {
      seen.add(name)
      variables.push(name)
    }
  }
  return variables
}

function longestLineWidth(textarea, text) {
  const style = window.getComputedStyle(textarea)
  const canvas =
    longestLineWidth.canvas ||
    (longestLineWidth.canvas = document.createElement('canvas'))
  const context = canvas.getContext('2d')
  context.font = `${style.fontSize} ${style.fontFamily}`
  let widest = 0
  for (const line of text.split('\n')) {
    widest = Math.max(widest, context.measureText(line).width)
  }
  return widest
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function TextNode({ id, data, selected }) {
  const updateNodeField = useStore((state) => state.updateNodeField)
  const updateNodeInternals = useUpdateNodeInternals()
  const textareaRef = useRef(null)
  const [text, setText] = useState(data?.text ?? '{{input}}')
  const [width, setWidth] = useState(MIN_WIDTH)

  const variables = useMemo(() => extractVariables(text), [text])

  const handles = useMemo(() => {
    const variableHandles = variables.map((name) => ({
      id: name,
      kind: 'target',
      side: 'left',
    }))
    return [...variableHandles, { id: 'output', kind: 'source', side: 'right' }]
  }, [variables])

  useLayoutEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${clamp(textarea.scrollHeight, MIN_BODY_HEIGHT, MAX_BODY_HEIGHT)}px`
    const measured = longestLineWidth(textarea, text) + 48
    setWidth(clamp(measured, MIN_WIDTH, MAX_WIDTH))
  }, [text])

  useEffect(() => {
    updateNodeInternals(id)
  }, [id, handles, width, updateNodeInternals])

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
      handles={handles}
      width={width}
    >
      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-medium text-muted-foreground">Text</span>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={onChange}
          rows={1}
          spellCheck={false}
          className="nodrag w-full resize-none rounded-md border bg-transparent px-2 py-1.5 text-xs shadow-xs outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/40"
        />
      </label>
    </BaseNode>
  )
}
