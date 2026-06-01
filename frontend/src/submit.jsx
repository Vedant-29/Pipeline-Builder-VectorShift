import { useState } from 'react'
import { useStore } from '@/store'

const ENDPOINT = 'http://localhost:8000/pipelines/parse'

export function useSubmit({ onResult, onError }) {
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    const { nodes, edges } = useStore.getState()
    setLoading(true)
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      })
      if (!response.ok) throw new Error(String(response.status))
      onResult(await response.json())
    } catch {
      onError('Backend unreachable')
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading }
}
