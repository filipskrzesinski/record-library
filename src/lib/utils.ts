import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Tell the merger these are sizes, not colors, so text-body and text-ink coexist.
export const textStyles = [
  'body', 'body-relaxed', 'small', 'caption', 'metadata', 'label', 'glyph',
  'heading', 'dialog', 'record-lg', 'record', 'record-md', 'record-sm', 'display', 'display-md', 'display-sm',
  'date', 'empty',
]

const twMerge = extendTailwindMerge({
  extend: { theme: { text: textStyles, radius: ['pill'] } },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}
