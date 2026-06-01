import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useUpdateNodeInternals } from '@xyflow/react'
import { Type } from 'lucide-react'
import { useStore } from '@/store'
import { BaseNode } from '@/nodes/BaseNode'

const ACCENT = '#0ea5e9'
const MIN_WIDTH = 230
const MAX_WIDTH = 440
const MIN_BODY_HEIGHT = 44
const MAX_BODY_HEIGHT = 320

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
      id: `var-${name}`,
      kind: 'target',
      side: 'left',
      label: name,
    }))
    return [...variableHandles, { id: 'output', kind: 'source', side: 'right' }]
  }, [variables])

  useLayoutEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${clamp(textarea.scrollHeight, MIN_BODY_HEIGHT, MAX_BODY_HEIGHT)}px`
    const measured = longestLineWidth(textarea, text) + 52
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
      icon={Type}
      accent={ACCENT}
      handles={handles}
      width={width}
    >
      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-medium text-slate-500">Text</span>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={onChange}
          rows={1}
          spellCheck={false}
          className="nodrag w-full resize-none rounded-md border border-slate-200 bg-transparent px-2.5 py-1.5 text-[13px] text-slate-800 shadow-xs outline-none transition-colors focus-visible:border-sky-400 focus-visible:ring-2 focus-visible:ring-sky-400/30"
        />
      </label>
    </BaseNode>
  )
}
