import dagre from '@dagrejs/dagre'

export function tidyLayout(nodes, edges) {
  if (nodes.length === 0) return nodes
  const graph = new dagre.graphlib.Graph()
  graph.setDefaultEdgeLabel(() => ({}))
  graph.setGraph({ rankdir: 'LR', nodesep: 48, ranksep: 96, marginx: 24, marginy: 24 })

  for (const node of nodes) {
    const width = node.measured?.width ?? node.data?.w ?? 250
    const height = node.measured?.height ?? node.data?.h ?? 130
    graph.setNode(node.id, { width, height })
  }
  for (const edge of edges) {
    graph.setEdge(edge.source, edge.target)
  }

  dagre.layout(graph)

  return nodes.map((node) => {
    const positioned = graph.node(node.id)
    return {
      ...node,
      position: {
        x: positioned.x - positioned.width / 2,
        y: positioned.y - positioned.height / 2,
      },
    }
  })
}
