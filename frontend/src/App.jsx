import { useEffect, useRef, useState } from 'react'
import { Workflow } from 'lucide-react'
import { PipelineToolbar } from '@/components/Toolbar'
import { PipelineUI } from '@/ui'
import { SubmitBar } from '@/submit'

function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}

function ResultOverlay({ feedback }) {
  if (!feedback) return null
  const { result, error } = feedback
  return (
    <div className="pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-center">
      <div className="animate-in fade-in slide-in-from-top-1 rounded-full border border-line bg-surface/95 px-3.5 py-1.5 text-xs duration-200">
        {error ? (
          <span className="text-clay">{error}</span>
        ) : (
          <span className="font-mono text-dim">
            {plural(result.num_nodes, 'node')} · {plural(result.num_edges, 'edge')}
            {' · '}
            <span className={result.is_dag ? 'text-faint' : 'text-clay'}>
              {result.is_dag ? 'valid DAG' : 'has a cycle'}
            </span>
          </span>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [feedback, setFeedback] = useState(null)
  const timerRef = useRef(null)

  const flash = (next) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setFeedback(next)
    timerRef.current = setTimeout(() => setFeedback(null), 4000)
  }

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    [],
  )

  return (
    <div className="flex h-screen flex-col gap-3 bg-subtle p-3 text-ink">
      <div className="rounded-xl border border-line bg-canvas">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md bg-ink text-canvas">
              <Workflow className="size-3.5" strokeWidth={2.25} />
            </span>
            <span className="text-sm font-semibold tracking-tight text-ink">
              VectorShift
            </span>
          </div>
          <SubmitBar
            onResult={(value) => flash({ result: value })}
            onError={(message) => flash({ error: message })}
          />
        </div>
        <PipelineToolbar />
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-line bg-canvas">
        <PipelineUI />
        <ResultOverlay feedback={feedback} />
      </div>
    </div>
  )
}
