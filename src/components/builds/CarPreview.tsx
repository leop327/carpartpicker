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
      <div className="car-preview__stage">
        <img
          className="car-preview__photo"
          src={car.image}
          alt={`${year} ${car.make} ${car.label}`}
          loading="lazy"
        />
        <span className="car-preview__paint" aria-hidden />
      </div>
      {!compact && (
        <div className="car-preview__label">
          <span className="car-preview__year">{year}</span>
          <strong>
            {car.make} {car.label}
          </strong>
          <span>{car.generation}</span>
        </div>
      )}
    </div>
  )
}
