from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NodeModel(BaseModel):
    id: str


class EdgeModel(BaseModel):
    source: str
    target: str


class PipelineModel(BaseModel):
    nodes: list[NodeModel]
    edges: list[EdgeModel]


def is_directed_acyclic_graph(nodes, edges):
    node_ids = {node.id for node in nodes}
    adjacency = {node_id: [] for node_id in node_ids}
    indegree = {node_id: 0 for node_id in node_ids}

    for edge in edges:
        if edge.source not in node_ids or edge.target not in node_ids:
            continue
        adjacency[edge.source].append(edge.target)
        indegree[edge.target] += 1

    ready = [node_id for node_id in node_ids if indegree[node_id] == 0]
    visited = 0

    while ready:
        current = ready.pop()
        visited += 1
        for neighbor in adjacency[current]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                ready.append(neighbor)

    return visited == len(node_ids)


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


@app.post('/pipelines/parse')
def parse_pipeline(pipeline: PipelineModel):
    return {
        'num_nodes': len(pipeline.nodes),
        'num_edges': len(pipeline.edges),
        'is_dag': is_directed_acyclic_graph(pipeline.nodes, pipeline.edges),
    }
