export function createsCycle(edges, source, target) {
  if (source === target) return true
  const adjacency = {}
  for (const edge of edges) {
    if (!adjacency[edge.source]) adjacency[edge.source] = []
    adjacency[edge.source].push(edge.target)
  }
  const stack = [target]
  const seen = new Set()
  while (stack.length) {
    const current = stack.pop()
    if (current === source) return true
    if (seen.has(current)) continue
    seen.add(current)
    for (const next of adjacency[current] ?? []) {
      stack.push(next)
    }
  }
  return false
}
