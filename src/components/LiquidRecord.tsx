/**
 * Adapted from the Subframe Motion Library example "Liquid record"
 * (https://www.subframe.com/motion/liquid-record), MIT © 2026 Subframe.
 * Retains the per-frame sine displacement of vector grooves and the spinning
 * label; the palette, the ripple taper and the segment budget are this app's.
 */
import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { GRAIN, recordStyle, sleeveBackStyle } from '@/lib/art'
import type { Palette } from '@/lib/types'
import { cn } from '@/lib/utils'

const CENTRE = 150
const OUTER = 143
const LABEL = 49
const GROOVES = 44
/** Peak warp at the outer edge, in viewBox units. */
const RIPPLE = 7

function useReducedMotion() {
  const [reduced, setReduced] = useState(true)
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced
}

function ripplePoint(x: number, y: number, time: number, amount: number) {
  return [
    x + Math.sin(y * 0.036 + time * 0.48) * Math.cos(x * 0.024 - time * 0.3) * amount * 0.3,
    y + Math.sin(x * 0.031 - time * 0.38) * Math.cos(y * 0.029 + time * 0.2) * amount * 0.3,
  ]
}

/**
 * One groove, deformed as a vector path so it stays smooth at any size. The
 * warp tapers toward the middle — the label is stiff paper, the outer lacquer
 * is not — and the segment count follows the radius, so the short inner grooves
 * cost a fraction of the long outer ones.
 */
function groovePath(radius: number, time: number) {
  const amount = RIPPLE * (radius / OUTER) ** 1.5
  const segments = Math.max(48, Math.round(radius * 0.9))
  return `${Array.from({ length: segments + 1 }, (_, index) => {
    const angle = (index / segments) * Math.PI * 2
    const [x, y] = ripplePoint(
      CENTRE + Math.cos(angle) * radius,
      CENTRE + Math.sin(angle) * radius,
      time,
      amount,
    )
    return `${index ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`
  }).join(' ')}Z`
}

/** 33⅓ turns in 14s reads as a record rather than a fan; faster pressings keep the ratio. */
function spin(speed?: string) {
  const rpm = Number(speed?.match(/\d+(?:\.\d+)?/)?.[0]) || 33.3
  return `${((14 * 33.3) / rpm).toFixed(1)}s`
}

export function LiquidRecord({
  palette,
  speed,
  spinning = false,
  alt = '',
  className,
}: {
  palette: Palette
  speed?: string
  spinning?: boolean
  alt?: string
  className?: string
}) {
  const style = recordStyle(palette)
  const sheen = `record-sheen-${useId().replace(/:/g, '')}`
  const grooves = useRef<SVGGElement>(null)
  const elapsed = useRef(0)
  const reduced = useReducedMotion()
  // The grooves are only re-plotted while the record faces the reader: the
  // sleeve side of the flip pays nothing for them.
  const running = spinning && !reduced

  useEffect(() => {
    const paths = grooves.current?.querySelectorAll<SVGPathElement>('[data-radius]')
    const paint = () =>
      paths?.forEach((path) => {
        path.setAttribute('d', groovePath(Number(path.dataset.radius), elapsed.current))
      })
    paint()
    if (!running) return
    let frame = 0
    let last = 0
    const tick = (now: number) => {
      if (last) elapsed.current += Math.min((now - last) / 1000, 0.04)
      last = now
      paint()
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [running])

  return (
    <div
      className={cn('liquid-record relative isolate overflow-hidden bg-well', className)}
      data-spinning={running}
      style={sleeveBackStyle(palette)}
    >
      <div
        className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: '140px 140px' }}
      />
      <div className="absolute inset-0 bg-sleeve-sheen" />
      <div className="absolute inset-0 shadow-sleeve-texture" />

      <svg className="liquid-record-disc" viewBox="0 0 300 300" role="img" aria-label={alt}>
        <defs>
          <linearGradient id={sheen} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={style.sheen} stopOpacity="0" />
            <stop offset="0.24" stopColor={style.sheen} stopOpacity="0.34" />
            <stop offset="0.44" stopColor={style.sheen} stopOpacity="0" />
            <stop offset="0.72" stopColor={style.sheen} stopOpacity="0.2" />
            <stop offset="1" stopColor={style.sheen} stopOpacity="0" />
          </linearGradient>
        </defs>

        <g ref={grooves}>
          <path
            data-radius={OUTER}
            d={groovePath(OUTER, 0)}
            fill={style.disc}
            stroke={style.rim}
            strokeWidth="1.5"
          />
          {Array.from({ length: GROOVES }, (_, index) => {
            const radius = LABEL + 5 + index * ((OUTER - LABEL - 14) / GROOVES)
            return (
              <path
                key={radius}
                data-radius={radius}
                d={groovePath(radius, 0)}
                fill="none"
                stroke={index % 2 ? style.grooveDark : style.grooveLight}
                strokeWidth="0.8"
              />
            )
          })}

          <path data-radius={LABEL} d={groovePath(LABEL, 0)} fill={style.label} />
          <g className="liquid-record-label" style={{ '--spin': spin(speed) } as CSSProperties}>
            <circle
              cx={CENTRE}
              cy={CENTRE}
              r={LABEL - 5}
              fill="none"
              stroke={style.labelInk}
              strokeOpacity="0.25"
              strokeWidth="1"
            />
            <path
              d={`M${CENTRE - 25} ${CENTRE - 25}H${CENTRE + 25}M${CENTRE - 25} ${CENTRE - 15}H${CENTRE + 11}`}
              stroke={style.labelInk}
              strokeOpacity="0.55"
              strokeWidth="2.5"
            />
            <text
              className="font-label text-label"
              x={CENTRE}
              y={CENTRE + 30}
              textAnchor="middle"
              fill={style.labelInk}
              fillOpacity="0.7"
            >
              {(speed || '33⅓ rpm').toUpperCase()}
            </text>
            <circle
              cx={CENTRE}
              cy={CENTRE}
              r="4.5"
              fill={style.disc}
              stroke={style.labelInk}
              strokeOpacity="0.3"
              strokeWidth="1.5"
            />
          </g>

          <path data-radius={OUTER - 2} d={groovePath(OUTER - 2, 0)} fill={`url(#${sheen})`} />
        </g>
      </svg>
    </div>
  )
}
