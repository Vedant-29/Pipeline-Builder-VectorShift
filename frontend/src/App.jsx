import { useState } from 'react'
import { Workflow } from 'lucide-react'
import { PipelineToolbar } from '@/components/Toolbar'
import { PipelineUI } from '@/ui'
import { SubmitBar } from '@/submit'
import { cn } from '@/lib/utils'

function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}

function ResultOverlay({ result, error }) {
  if (!result && !error) return null
  return (
    <div className="pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-center">
      <div className="rounded-full border border-line bg-surface/95 px-3.5 py-1.5 text-xs">
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
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  return (
    <div className="flex h-screen flex-col bg-subtle text-ink">
      <header className="flex items-center justify-between border-b border-line bg-surface px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-md bg-ink text-canvas">
            <Workflow className="size-4" strokeWidth={2.25} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-ink">
            VectorShift
          </span>
        </div>
        <SubmitBar
          onResult={(value) => {
            setResult(value)
            setError(null)
          }}
          onError={(message) => {
            setError(message)
            setResult(null)
          }}
        />
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        <PipelineToolbar />
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-line bg-canvas">
          <PipelineUI />
          <ResultOverlay result={result} error={error} />
        </div>
      </div>
    </div>
  )
}
