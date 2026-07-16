import { useEffect, useState, type CSSProperties } from 'react'
import type { CarModel, Colour } from '../../types/catalog'
import './CarPreview.css'

interface Props {
  car: CarModel
  colour: Colour
  year: number
  compact?: boolean
}

export function CarPreview({ car, colour, year, compact }: Props) {
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    setFlash(true)
    const t = window.setTimeout(() => setFlash(false), 550)
    return () => window.clearTimeout(t)
  }, [colour.id])

  return (
    <div
      className={[
        'car-preview',
        compact ? 'car-preview--compact' : '',
        flash ? 'car-preview--flash' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ '--paint': colour.hex } as CSSProperties}
    >
      <div className="car-preview__stage">
        <img
          className="car-preview__photo"
          src={car.image}
          alt={`${year} ${car.make} ${car.label}`}
          loading="lazy"
        />
        <div className="car-preview__grade" aria-hidden />
        <div className="car-preview__wash" aria-hidden />
        <span className="car-preview__paint" aria-hidden />
        {!compact && (
          <span className="car-preview__swatch-chip" aria-hidden>
            {colour.name}
          </span>
        )}
      </div>
      {!compact && (
        <div className="car-preview__label">
          <span className="car-preview__year">{year}</span>
          <strong>
            {car.make} {car.label}
          </strong>
          <span>{car.tagline ?? car.generation}</span>
        </div>
      )}
    </div>
  )
}
