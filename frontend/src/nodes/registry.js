import {
  LogIn,
  LogOut,
  Sparkles,
  Type,
  Calculator,
  Filter,
  Globe,
  StickyNote,
  GitBranch,
} from 'lucide-react'
import { TextNode } from '@/nodes/textNode'

export const accents = {
  customInput: '#10b981',
  llm: '#8b5cf6',
  customOutput: '#3b82f6',
  text: '#0ea5e9',
  math: '#f59e0b',
  filter: '#06b6d4',
  api: '#6366f1',
  note: '#eab308',
  conditional: '#f43f5e',
}

export const nodeDefs = [
  {
    type: 'customInput',
    label: 'Input',
    title: 'Input',
    icon: LogIn,
    accent: accents.customInput,
    fields: [
      {
        key: 'inputName',
        label: 'Name',
        type: 'text',
        default: (id) => id.replace('customInput-', 'input_'),
      },
      {
        key: 'inputType',
        label: 'Type',
        type: 'select',
        default: 'Text',
        options: ['Text', 'File'],
      },
    ],
    handles: [{ id: 'value', kind: 'source', side: 'right' }],
  },
  {
    type: 'llm',
    label: 'LLM',
    title: 'LLM',
    icon: Sparkles,
    accent: accents.llm,
    description: 'This is a LLM.',
    fields: [],
    handles: [
      { id: 'system', kind: 'target', side: 'left', label: 'system' },
      { id: 'prompt', kind: 'target', side: 'left', label: 'prompt' },
      { id: 'response', kind: 'source', side: 'right', label: 'response' },
    ],
  },
  {
    type: 'customOutput',
    label: 'Output',
    title: 'Output',
    icon: LogOut,
    accent: accents.customOutput,
    fields: [
      {
        key: 'outputName',
        label: 'Name',
        type: 'text',
        default: (id) => id.replace('customOutput-', 'output_'),
      },
      {
        key: 'outputType',
        label: 'Type',
        type: 'select',
        default: 'Text',
        options: ['Text', 'Image'],
      },
    ],
    handles: [{ id: 'value', kind: 'target', side: 'left' }],
  },
  {
    type: 'text',
    label: 'Text',
    icon: Type,
    accent: accents.text,
    component: TextNode,
  },
  {
    type: 'math',
    label: 'Math',
    title: 'Math',
    icon: Calculator,
    accent: accents.math,
    fields: [
      {
        key: 'operation',
        label: 'Operation',
        type: 'select',
        default: 'add',
        options: [
          { value: 'add', label: 'Add' },
          { value: 'subtract', label: 'Subtract' },
          { value: 'multiply', label: 'Multiply' },
          { value: 'divide', label: 'Divide' },
        ],
      },
    ],
    handles: [
      { id: 'a', kind: 'target', side: 'left', label: 'a' },
      { id: 'b', kind: 'target', side: 'left', label: 'b' },
      { id: 'result', kind: 'source', side: 'right', label: 'result' },
    ],
  },
  {
    type: 'filter',
    label: 'Filter',
    title: 'Filter',
    icon: Filter,
    accent: accents.filter,
    fields: [
      {
        key: 'condition',
        label: 'Condition',
        type: 'text',
        placeholder: 'value > 0',
      },
    ],
    handles: [
      { id: 'input', kind: 'target', side: 'left' },
      { id: 'output', kind: 'source', side: 'right' },
    ],
  },
  {
    type: 'api',
    label: 'API',
    title: 'API Request',
    icon: Globe,
    accent: accents.api,
    fields: [
      {
        key: 'url',
        label: 'URL',
        type: 'text',
        placeholder: 'https://api.example.com',
      },
      {
        key: 'method',
        label: 'Method',
        type: 'select',
        default: 'GET',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
      },
    ],
    handles: [
      { id: 'body', kind: 'target', side: 'left', label: 'body' },
      { id: 'response', kind: 'source', side: 'right', label: 'response' },
    ],
  },
  {
    type: 'note',
    label: 'Note',
    title: 'Note',
    icon: StickyNote,
    accent: accents.note,
    fields: [{ key: 'note', type: 'textarea', placeholder: 'Write a note...' }],
    handles: [],
  },
  {
    type: 'conditional',
    label: 'Conditional',
    title: 'Conditional',
    icon: GitBranch,
    accent: accents.conditional,
    fields: [
      {
        key: 'expression',
        label: 'Expression',
        type: 'text',
        placeholder: 'x === true',
      },
    ],
    handles: [
      { id: 'input', kind: 'target', side: 'left' },
      { id: 'true', kind: 'source', side: 'right', label: 'true' },
      { id: 'false', kind: 'source', side: 'right', label: 'false' },
    ],
  },
]
