# Implementation Plan

A visual pipeline builder: a ReactFlow canvas where nodes are dragged out,
configured, and connected, then submitted to a FastAPI backend that reports
node/edge counts and whether the graph is a DAG.

This plan is the source of truth. Build only what the four parts below require.
Nothing beyond the PDF scope.

## Stack decisions

| Decision | Choice | Reason |
|---|---|---|
| Bundler | Migrate CRA to Vite, keep a `start` script | shadcn needs a modern bundler; CRA is deprecated and unsupported by the shadcn CLI. `npm start` still works for the grader. |
| Language | JavaScript + JSX | PDF says JavaScript/React. shadcn generated as JSX, not TS. |
| UI kit | Tailwind + shadcn/ui (neutral theme) | Requested. Minimal, accessible Radix primitives, no gradients. |
| State | Keep the existing zustand store, extend it | Already wired into the canvas. |
| Backend | Keep FastAPI, one POST endpoint | Matches the PDF. |
| Comments | None anywhere | Project rule: self-documenting code only. |

shadcn surface stays small: Button, Input, Select, Textarea, Label, Card, Sonner.
Only what the four parts use.

## Target structure

```
frontend/
  index.html             Vite entry
  vite.config.js         react + tailwind plugins, @/ alias
  jsconfig.json          @/ -> src
  components.json        shadcn config (jsx, neutral)
  src/
    main.jsx             entry (was index.js)
    App.jsx
    index.css            tailwind + shadcn theme tokens
    lib/utils.js         cn() helper
    components/ui/        shadcn primitives
    components/
      Toolbar.jsx  DraggableNode.jsx  SubmitBar.jsx  ResultAlert (sonner)
    nodes/
      BaseNode.jsx       shell: title, body, auto-positioned handles
      NodeField.jsx      one field by type (text/select/textarea/number)
      registry.js        one entry per node type (the abstraction payoff)
      textNode.jsx       custom node: autosize + variable handles (Part 3)
    store.js  ui.jsx  submit.jsx
backend/
  main.py                POST /pipelines/parse, CORS, DAG check
```

## Part 1: Node abstraction

The four starter nodes repeat a container, a title, handles, and field state.
The abstraction collapses that into one shell plus a declarative registry.

**BaseNode** renders from a definition:

```
<BaseNode
  id, data
  title="Input"
  fields={[{ key, label, type, options?, placeholder?, default? }]}
  handles={[{ id, kind: 'source'|'target', side: 'left'|'right', label? }]}
/>
```

- Field state reads/writes the zustand store via the existing `updateNodeField`,
  keyed by node id + field key. Initial value from `data` or the field default.
- Handles render and self-position. Multiple handles on a side spread evenly:
  `top: (i + 1) / (count + 1) * 100%`.
- Custom nodes (Text) pass `children` for a bespoke body and still get the shell.

**registry.js** lists every node type in one place:

```
{ type, label, title, fields, handles, component? }
```

`ui.jsx` builds `nodeTypes` from the registry. `Toolbar.jsx` builds its draggable
chips from the registry. Adding a simple node = one registry entry, no new file.

**Refactor** the 4 starter nodes (Input, Output, LLM, Text) onto this.

**5 new nodes** demonstrating flexibility (function is intentionally trivial):

| Node | Fields | Inputs (left) | Outputs (right) | Shows |
|---|---|---|---|---|
| Math | operation (select) | a, b | result | multiple inputs + select |
| Filter | condition (text) | input | output | simple passthrough |
| API | url (text), method (select) | body | response | mixed field types |
| Note | note (textarea) | none | none | zero handles, free text |
| Conditional | expression (text) | input | true, false | multiple outputs |

## Part 2: Styling

shadcn + Tailwind, no gradients. Each node type carries its own accent color
(Input emerald, LLM violet, Output blue, Text sky, Math amber, Filter cyan, API
indigo, Note yellow, Conditional rose) used on its icon chip, handles, and minimap
swatch. White node cards on a slate canvas with a visible dotted background.

| Surface | Treatment |
|---|---|
| Canvas | slate-50 with a `Dots` background; styled Controls and a color-coded MiniMap |
| Node | white card, icon-chip header in the node accent, labeled colored handles |
| Fields | shadcn Input/Select/Textarea with small slate labels |
| Toolbar | white chips with accent icons and a hover lift |
| Header | indigo logo mark, wordmark, indigo Submit; result alert is a Sonner toast |

Per-type accents plus consistent spacing keep it lively but unified.

## Part 3: Text node logic

Custom component on top of BaseNode.

1. **Autosize.** Body is a textarea. Height grows to content via `scrollHeight`.
   Width grows with the longest line, clamped to a min/max. Recompute on input.
2. **Variables.** Parse `{{ name }}` where `name` is a valid JS identifier
   (`/^[A-Za-z_$][A-Za-z0-9_$]*$/`). Extract with
   `/\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g`, dedupe, and render one left-side
   target handle per unique variable, spread evenly. Invalid names are ignored.
   Handles update live as the text changes.

## Part 4: Backend integration

**Backend** (`main.py`): change `/pipelines/parse` to `POST`, accept
`{ nodes, edges }` as JSON via Pydantic models. Compute:
- `num_nodes = len(nodes)`
- `num_edges = len(edges)`
- `is_dag`: Kahn's topological sort over edges (source to target). If every node is
  removed, the graph is acyclic. Empty/edge-free graphs are DAGs.

Return `{ num_nodes, num_edges, is_dag }`. Add CORS middleware for the dev frontend.

**Frontend** (`submit.jsx`): on click, read `nodes` and `edges` from the store,
POST them to `/pipelines/parse`, and show a Sonner toast with the three values in
plain language. Errors surface a readable message.

## Verification

After the build, fan out independent reviewer agents, one per concern:
abstraction quality, Part 3 logic + edge cases, Part 4 DAG correctness + wiring,
and styling/UX consistency. Plus a real `npm run build` and a backend smoke test
(known DAG and known cycle). Findings are fixed and compiled into a report.

## Conflict-resolution notes

- shadcn requires Tailwind + a modern bundler, so the CRA app migrates to Vite.
  `npm start` is preserved so the PDF run instructions still hold.
- "Alert" implemented as a Sonner toast, satisfying both the literal ask and
  Part 2's unified design.
- Scope stays exactly at the four parts. No execution engine, no real LLM calls.

## Build sequence

1. Migrate frontend to Vite + Tailwind + shadcn; preserve `npm start`.
2. BaseNode + NodeField + registry; refactor the 4 starter nodes.
3. Add the 5 new nodes via registry; wire `ui.jsx` and `Toolbar.jsx` to it.
4. Text node autosize + variable handles.
5. Backend POST + DAG + CORS; frontend submit + Sonner result toast.
6. Multi-agent verification, fixes, report.
