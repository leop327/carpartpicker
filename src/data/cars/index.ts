import type { CarModel } from '../../types/catalog'
import { bmwM3G80 } from './bmw-m3-g80'
import { fordMustangS650 } from './ford-mustang-s650'
import { hondaCivicTypeRFl5 } from './honda-civic-type-r-fl5'
import { mazdaMx5Nd } from './mazda-mx5-nd'
import { subaruWrxVb } from './subaru-wrx-vb'

/**
 * Register new cars here only.
 * UI reads from this list — no page changes needed for new models.
 */
export const cars: CarModel[] = [
  bmwM3G80,
  hondaCivicTypeRFl5,
  mazdaMx5Nd,
  subaruWrxVb,
  fordMustangS650,
]

export function getCarById(id: string): CarModel | undefined {
  return cars.find((car) => car.id === id)
}
