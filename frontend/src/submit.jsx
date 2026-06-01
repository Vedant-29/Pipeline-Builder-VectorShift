import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useStore } from '@/store'

const ENDPOINT = 'http://localhost:8000/pipelines/parse'

function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}

export function SubmitBar() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const onSubmit = async () => {
    const { nodes, edges } = useStore.getState()
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      })
      if (!response.ok) throw new Error(String(response.status))
      setResult(await response.json())
    } catch {
      setResult(null)
      setError('Backend unreachable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {error ? (
        <span className="text-xs text-clay">{error}</span>
      ) : result ? (
        <div className="flex items-center gap-2.5 text-xs">
          <span className="font-mono text-dim">
            {plural(result.num_nodes, 'node')} · {plural(result.num_edges, 'edge')}
          </span>
          <span
            className={cn(
              'rounded-full border px-2 py-0.5 font-medium',
              result.is_dag
                ? 'border-line text-dim'
                : 'border-clay/50 text-clay',
            )}
          >
            {result.is_dag ? 'valid DAG' : 'has a cycle'}
          </span>
        </div>
      ) : null}
      <Button
        onClick={onSubmit}
        disabled={loading}
        size="sm"
        className="bg-ink text-canvas hover:bg-ink/90"
      >
        {loading ? 'Submitting…' : 'Submit'}
      </Button>
    </div>
  )
}
