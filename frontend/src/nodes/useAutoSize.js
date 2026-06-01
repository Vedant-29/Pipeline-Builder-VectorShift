import { useLayoutEffect, useRef, useState } from 'react'

const MIN_WIDTH = 230
const MAX_WIDTH = 440
const MIN_HEIGHT = 44
const MAX_HEIGHT = 320

export const AUTOSIZE_TEXTAREA_CLASS =
  'nodrag w-full resize-none rounded-md border border-line bg-surface px-2.5 py-1.5 font-mono text-[12.5px] text-ink outline-none transition-colors placeholder:text-faint focus-visible:border-clay focus-visible:ring-2 focus-visible:ring-clay/20'

function longestLineWidth(textarea, text) {
  const style = window.getComputedStyle(textarea)
  const canvas =
    longestLineWidth.canvas ||
    (longestLineWidth.canvas = document.createElement('canvas'))
  const context = canvas.getContext('2d')
  context.font = `${style.fontSize} ${style.fontFamily}`
  let widest = 0
  for (const line of text.split('\n')) {
    widest = Math.max(widest, context.measureText(line).width)
  }
  return widest
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function useAutoSize(text, enabled = true) {
  const textareaRef = useRef(null)
  const [width, setWidth] = useState(MIN_WIDTH)

  useLayoutEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    if (!enabled) {
      textarea.style.height = ''
      return
    }
    textarea.style.height = 'auto'
    textarea.style.height = `${clamp(textarea.scrollHeight, MIN_HEIGHT, MAX_HEIGHT)}px`
    setWidth(clamp(longestLineWidth(textarea, text) + 52, MIN_WIDTH, MAX_WIDTH))
  }, [text, enabled])

  return { textareaRef, width }
}
