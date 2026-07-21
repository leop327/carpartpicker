import { useEffect, useState, type CSSProperties } from 'react'
import type { CarModel, Colour } from '../../types/catalog'
import { resolvePaintPhoto } from '../../data/cars/paintImages'
import { tintCarImage } from '../../lib/tintCarImage'
import './CarPreview.css'

interface Props {
  car: CarModel
  colour: Colour
  year: number
  compact?: boolean
}

export function CarPreview({ car, colour, year, compact }: Props) {
  const [flash, setFlash] = useState(false)
  const [src, setSrc] = useState(() => car.image)
  const [status, setStatus] = useState<'photo' | 'tinting' | 'tint'>('tinting')

  useEffect(() => {
    setFlash(true)
    const t = window.setTimeout(() => setFlash(false), 550)
    return () => window.clearTimeout(t)
  }, [colour.id, src])

  useEffect(() => {
    const photo = resolvePaintPhoto(car, colour)
    if (photo) {
      setSrc(photo)
      setStatus('photo')
      return
    }

    if (compact) {
      setSrc(car.image)
      setStatus('tint')
      return
    }

    const ac = new AbortController()
    setSrc(car.image)
    setStatus('tinting')

    tintCarImage(car.image, colour.hex)
      .then((tinted) => {
        if (ac.signal.aborted) return
        setSrc(tinted)
        setStatus('tint')
      })
      .catch(() => {
        if (ac.signal.aborted) return
        setSrc(car.image)
        setStatus('tint')
      })

    return () => ac.abort()
  }, [car, colour, year, compact])

  return (
    <div
      className={[
        'car-preview',
        compact ? 'car-preview--compact' : '',
        flash ? 'car-preview--flash' : '',
        status === 'tinting' ? 'car-preview--loading' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ '--paint': colour.hex } as CSSProperties}
    >
      <div className="car-preview__stage">
        <img
          className="car-preview__photo"
          src={src}
          alt={`${year} ${car.make} ${car.label} in ${colour.name}`}
          loading="lazy"
        />
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
          <span className="car-preview__hint">
            {status === 'photo'
              ? 'Real paint photo'
              : status === 'tinting'
                ? 'Applying colour…'
                : 'Colour preview'}
          </span>
        </div>
      )}
    </div>
  )
}
