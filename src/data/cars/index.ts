import type { CarModel } from '../../types/catalog'
import { bmw135iE82N54 } from './bmw-135i-e82-n54'
import { bmw135iE82N55 } from './bmw-135i-e82-n55'
import { bmwM140iF20 } from './bmw-m140i-f20'
import { bmwM235iF22 } from './bmw-m235i-f22'
import { bmwM2CompetitionF87 } from './bmw-m2-competition-f87'
import { bmwM2F87 } from './bmw-m2-f87'

/**
 * Register new cars here only.
 * UI reads from this list — no page changes needed for new models.
 */
export const cars: CarModel[] = [
  bmw135iE82N54,
  bmw135iE82N55,
  bmwM2F87,
  bmwM2CompetitionF87,
  bmwM140iF20,
  bmwM235iF22,
]

export function getCarById(id: string): CarModel | undefined {
  return cars.find((car) => car.id === id)
}

export function getMakes(): string[] {
  return [...new Set(cars.map((c) => c.make))].sort()
}

export function getCarsByMake(make: string): CarModel[] {
  return cars.filter((c) => c.make === make)
}
