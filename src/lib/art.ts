import type { CSSProperties } from 'react'
import type { ArtStyle, Palette } from './types'

/** Printed-paper noise, rasterised once and reused by every sleeve. */
export const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")"

export const ART_STYLES: ArtStyle[] = [
  'field',
  'bands',
  'orb',
  'horizon',
  'split',
  'arc',
  'prism',
  'flat',
]

export const PALETTES: { name: string; palette: Palette }[] = [
  { name: 'Indigo', palette: { base: '#1f4a72', accent: '#78a8c9', deep: '#0e2438', ink: '#e8eef3' } },
  { name: 'Graphite', palette: { base: '#22232a', accent: '#5b3ea8', deep: '#101116', ink: '#efe9df' } },
  { name: 'Lacquer', palette: { base: '#26221f', accent: '#b8352c', deep: '#131110', ink: '#e8e2d8' } },
  { name: 'Ochre', palette: { base: '#8a6236', accent: '#d9a95c', deep: '#3f2a16', ink: '#f6ecd9' } },
  { name: 'Midnight', palette: { base: '#1a2c46', accent: '#3f7fa8', deep: '#0c1521', ink: '#e6ecf2' } },
  { name: 'Steel', palette: { base: '#3d6f96', accent: '#c8d4dc', deep: '#1b3852', ink: '#f0f4f7' } },
  { name: 'Amber', palette: { base: '#b45f2e', accent: '#e6a765', deep: '#5e2c12', ink: '#fbf1e4' } },
  { name: 'Oxblood', palette: { base: '#7d2f2a', accent: '#c96a4a', deep: '#331010', ink: '#f4e3d8' } },
  { name: 'Olive', palette: { base: '#6f6a45', accent: '#b6ae7c', deep: '#2e2c1c', ink: '#f2efdf' } },
  { name: 'Marigold', palette: { base: '#d1762a', accent: '#f0c04a', deep: '#8c2f14', ink: '#2a1a0c' } },
  { name: 'Sage', palette: { base: '#5c7361', accent: '#a9bda6', deep: '#25352b', ink: '#eef2ea' } },
  { name: 'Bone', palette: { base: '#ddd5c6', accent: '#b0a48d', deep: '#8d8270', ink: '#302b23' } },
]

/** Layered gradients standing in for the sleeve artwork. */
export function coverStyle(art: ArtStyle, p: Palette): CSSProperties {
  const layers: string[] = []

  switch (art) {
    case 'field':
      layers.push(`radial-gradient(78% 66% at 27% 21%, ${p.accent} 0%, transparent 63%)`)
      layers.push(`radial-gradient(72% 62% at 84% 90%, ${p.deep} 0%, transparent 58%)`)
      layers.push(`linear-gradient(154deg, ${p.base} 0%, ${p.deep} 100%)`)
      break
    case 'bands':
      layers.push(
        `linear-gradient(180deg, transparent 0 24%, ${p.accent} 24% 33%, transparent 33% 57%, ${p.accent} 57% 60%, transparent 60% 74%, ${p.accent} 74% 75.5%, transparent 75.5%)`,
      )
      layers.push(`linear-gradient(180deg, ${p.base} 0%, ${p.deep} 100%)`)
      break
    case 'orb':
      layers.push(`radial-gradient(circle at 50% 43%, ${p.accent} 0 26%, transparent 26.4%)`)
      layers.push(`radial-gradient(circle at 50% 43%, transparent 0 33%, ${p.accent}55 33% 33.8%, transparent 34.2%)`)
      layers.push(`linear-gradient(165deg, ${p.base} 0%, ${p.deep} 100%)`)
      break
    case 'horizon':
      layers.push(`radial-gradient(56% 30% at 50% 60%, ${p.accent} 0%, transparent 72%)`)
      layers.push(`linear-gradient(180deg, ${p.base} 0 60%, ${p.deep} 60% 100%)`)
      break
    case 'split':
      layers.push(`linear-gradient(113deg, transparent 0 45%, ${p.accent} 45% 100%)`)
      layers.push(`linear-gradient(200deg, ${p.base} 0%, ${p.deep} 100%)`)
      break
    case 'arc':
      layers.push(`radial-gradient(circle at 6% 104%, ${p.accent} 0 48%, transparent 48.4%)`)
      layers.push(`linear-gradient(150deg, ${p.base} 0%, ${p.deep} 100%)`)
      break
    case 'prism':
      layers.push(`linear-gradient(101deg, transparent 0 46.6%, ${p.ink} 46.6% 47.2%, transparent 47.2%)`)
      layers.push(`radial-gradient(46% 38% at 63% 54%, ${p.accent} 0%, transparent 74%)`)
      layers.push(`linear-gradient(170deg, ${p.base} 0%, ${p.deep} 100%)`)
      break
    case 'flat':
    default:
      layers.push(`linear-gradient(168deg, ${p.base} 0%, ${p.deep} 100%)`)
  }

  return { backgroundImage: layers.join(', ') }
}

/** The edge of the sleeve, as seen on a shelf. */
export function spineStyle(p: Palette): CSSProperties {
  return {
    backgroundImage: [
      `linear-gradient(180deg, ${p.ink}26 0 1px, transparent 1px 3px, ${p.deep}59 100%)`,
      `linear-gradient(92deg, ${p.deep} 0%, ${p.base} 14%, ${p.base} 82%, ${p.deep} 100%)`,
    ].join(', '),
    color: p.ink,
  }
}
