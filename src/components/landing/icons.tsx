/** 16px marks for the landing page's detail rows, drawn like the top bar's toggles. */
const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  fill: 'currentColor',
  'aria-hidden': true,
} as const

/** Four sleeves, one of them turned to face front. */
export function ViewsIcon() {
  return (
    <svg {...iconProps}>
      <rect x="1" y="2" width="4" height="5.5" rx="0.75" />
      <rect x="6.25" y="2" width="4" height="5.5" rx="0.75" opacity="0.45" />
      <rect x="11.5" y="2" width="3.5" height="5.5" rx="0.75" opacity="0.45" />
      <rect x="1" y="8.5" width="14" height="5.5" rx="0.75" opacity="0.45" />
    </svg>
  )
}

/** A spec sheet: label on the left, value on the right. */
export function SpecIcon() {
  return (
    <svg {...iconProps}>
      <rect x="1" y="2.5" width="4.5" height="1.5" rx="0.75" />
      <rect x="7.5" y="2.5" width="7.5" height="1.5" rx="0.75" opacity="0.45" />
      <rect x="1" y="7.25" width="4.5" height="1.5" rx="0.75" />
      <rect x="7.5" y="7.25" width="5.5" height="1.5" rx="0.75" opacity="0.45" />
      <rect x="1" y="12" width="4.5" height="1.5" rx="0.75" />
      <rect x="7.5" y="12" width="6.5" height="1.5" rx="0.75" opacity="0.45" />
    </svg>
  )
}

/** A needle resting in a groove. */
export function ListenIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="8" cy="8" r="6.75" fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.45" />
      <circle cx="8" cy="8" r="3.25" fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.45" />
      <circle cx="8" cy="8" r="1.15" />
      <rect x="9.9" y="1.6" width="1.4" height="7.2" rx="0.7" transform="rotate(34 10.6 5.2)" />
    </svg>
  )
}

/** The five-step rating, as the app draws it. */
export function RatingIcon() {
  return (
    <svg {...iconProps}>
      <rect x="1" y="3" width="14" height="1.75" rx="0.875" />
      <rect x="1" y="7.125" width="14" height="1.75" rx="0.875" />
      <rect x="1" y="11.25" width="9" height="1.75" rx="0.875" />
      <rect x="10.5" y="11.25" width="4.5" height="1.75" rx="0.875" opacity="0.3" />
    </svg>
  )
}

/** Stacked storage, held in place. */
export function LocalIcon() {
  return (
    <svg {...iconProps}>
      <ellipse cx="8" cy="3.5" rx="6" ry="2.25" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M2 3.5v4c0 1.24 2.69 2.25 6 2.25s6-1.01 6-2.25v-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.45"
      />
      <path
        d="M2 7.5v4c0 1.24 2.69 2.25 6 2.25s6-1.01 6-2.25v-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.45"
      />
    </svg>
  )
}

/** A text cursor over the underline the inline editor draws. */
export function EditIcon() {
  return (
    <svg {...iconProps}>
      <rect x="7.25" y="2" width="1.5" height="8" rx="0.75" />
      <rect x="4.5" y="2" width="7" height="1.4" rx="0.7" opacity="0.45" />
      <rect x="4.5" y="8.6" width="7" height="1.4" rx="0.7" opacity="0.45" />
      <rect x="1" y="12.75" width="14" height="1.25" rx="0.625" />
    </svg>
  )
}
