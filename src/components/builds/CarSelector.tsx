import type { CarModel } from '../../types/catalog'
import './CarSelector.css'

interface Props {
  cars: CarModel[]
  onSelect: (carId: string) => void
}

export function CarSelector({ cars, onSelect }: Props) {
  return (
    <div className="car-selector" role="list">
      {cars.map((car) => (
        <button
          key={car.id}
          type="button"
          className="car-selector__item"
          role="listitem"
          onClick={() => onSelect(car.id)}
        >
          <span className="car-selector__make">{car.make}</span>
          <span className="car-selector__model">
            {car.model}{' '}
            <span className="car-selector__gen">{car.generation}</span>
          </span>
          <span className="car-selector__years">
            {car.years[0]}–{car.years[car.years.length - 1]}
          </span>
          <span className="car-selector__desc">{car.description}</span>
        </button>
      ))}
    </div>
  )
}
