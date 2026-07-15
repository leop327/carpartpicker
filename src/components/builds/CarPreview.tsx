import type { CSSProperties } from 'react'
import type { CarModel, Colour } from '../../types/catalog'
import './CarPreview.css'

interface Props {
  car: CarModel
  colour: Colour
  year: number
  compact?: boolean
}

export function CarPreview({ car, colour, year, compact }: Props) {
  return (
    <div
      className={compact ? 'car-preview car-preview--compact' : 'car-preview'}
      style={{ '--paint': colour.hex } as CSSProperties}
    >
      <div className="car-preview__stage" aria-hidden>
        <div className="car-preview__glow" />
        <svg
          className="car-preview__silhouette"
          viewBox="0 0 320 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="car-preview__body"
            d="M28 78c8-22 28-38 52-44 18-4 36-8 58-8h48c22 0 40 2 58 10 16 8 28 14 40 28l18 2c8 0 14 6 14 14v8H20v-6c0-6 2-10 8-12z"
          />
          <path
            className="car-preview__cabin"
            d="M108 40c18-10 34-14 58-14h20c18 0 32 4 46 14l-8 22H118l-10-22z"
          />
          <circle className="car-preview__wheel" cx="78" cy="88" r="18" />
          <circle className="car-preview__wheel" cx="248" cy="88" r="18" />
          <circle className="car-preview__hub" cx="78" cy="88" r="7" />
          <circle className="car-preview__hub" cx="248" cy="88" r="7" />
        </svg>
      </div>
      {!compact && (
        <div className="car-preview__label">
          <span className="car-preview__year">{year}</span>
          <strong>
            {car.make} {car.model}
          </strong>
          <span>{car.generation}</span>
        </div>
      )}
    </div>
  )
}
