# Verification Report

Cross-verification of the four assessment parts: a production build, isolated
logic tests, backend smoke tests, a four-agent independent code review, and a
live browser dogfood of every part.

## Status

| Part | Result |
|---|---|
| 1. Node abstraction | Pass. 9 nodes render from one declarative registry; adding a node is one entry. |
| 2. Styling | Pass. Unified shadcn/Tailwind design, single indigo accent, no gradients. |
| 3. Text node logic | Pass. Width and height autosize; valid `{{var}}` names create deduped left handles live. |
| 4. Backend integration | Pass. Submit posts the graph; backend returns `{num_nodes, num_edges, is_dag}`; toast shows it. |

## How it was verified

**Production build.** `npm run build` compiles clean (2039 modules). The backend
imports and serves under uvicorn.

**Logic tests.** Variable extraction was unit-tested against 10 cases including
invalid identifiers (`{{1bad}}`, `{{a-b}}`, `{{}}`), duplicates, and whitespace.
All pass. The DAG endpoint was smoke-tested with curl: chain (DAG), 2-cycle (not
DAG), self-loop (not DAG), 3-cycle (not DAG), diamond (DAG), parallel edges (DAG),
empty (DAG), and a full ReactFlow payload with extra fields (parsed, extras ignored).
All correct.

**Four-agent code review.** Independent reviewers covered the abstraction, the text
node, the backend + submit, and styling/UX. Dispositions below.

**Live browser dogfood.** Nodes render with fields, defaults, and indigo handles.
Typing `Hello {{ name }}, write about {{ topic }} for {{ name }}` into the Text node
produced exactly two left handles (deduped) and widened the node. Submit produced
`3 nodes, 0 edges. This pipeline is a valid DAG.`; after injecting a cycle,
`3 nodes, 2 edges. This pipeline is not a DAG (it contains a cycle).`

## Review findings and dispositions

**Fixed**

| Finding | File | Action |
|---|---|---|
| `{{output}}` variable handle could collide with the node's output handle id | textNode.jsx | Namespaced variable handles as `var-<name>`. |
| Module-scoped regex carried `lastIndex` state across calls | textNode.jsx | Moved the regex inside the function. |
| `onDrop` could read a null instance if a drop fired before init | ui.jsx | Added an early return guard. |
| `rfInstance.project()` is deprecated in ReactFlow 11 | ui.jsx | Switched to `screenToFlowPosition`. |
| Zustand `create` + equality-fn selector logged a deprecation warning | store.js | Switched to `createWithEqualityFn`. |
| Draggable chips had no keyboard focus state | DraggableNode.jsx | Added `tabIndex` and a focus ring. |
| Handle border used a raw hex | index.css | Switched to `var(--background)`. |

**Dismissed (with reason)**

| Finding | Reason |
|---|---|
| "Parallel edges make Kahn's report a DAG as cyclic" (called critical) | False positive. The adjacency list receives the duplicate edge too, so in-degree is decremented to zero. Verified live: parallel `A->B` returns `is_dag: true`. |
| "Text node local state desyncs from the store" | The textarea is the only writer of `data.text`, and local state plus a store mirror is the standard ReactFlow node pattern. No active divergence. |
| "`.dark` block is dead code" | Standard shadcn output; harmless and conventional to keep. |
| Chip hover background close to card background | The indigo hover border already gives clear feedback. |

## Scope and conventions

No features beyond the four parts. No execution engine and no real LLM calls
(the LLM node is a visual placeholder, as in the starter). No code comments in any
source file. `npm start` still runs the app (aliased to Vite) per the PDF.
