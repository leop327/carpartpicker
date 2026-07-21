import type { CarModel, Colour } from '../../types/catalog'

/**
 * Manual paint photos. Key = `${carId}:${colourId}`.
 * Drop files in `public/cars/paint/` then register the path here
 * (or set `colour.image` on the car data).
 *
 * Naming tip: `/cars/paint/{car-id}--{colour-id}.jpg`
 * Example: `/cars/paint/bmw-135i-e82-n54--alpine-white.jpg`
 */
export const paintImages: Record<string, string> = {
  'bmw-m2-f87:long-beach-blue':
    '/cars/paint/bmw-m2-f87--long-beach-blue.jpg',
  'bmw-m2-f87:alpine-white': '/cars/paint/bmw-m2-f87--alpine-white.jpg',
  'bmw-m2-f87:mineral-grey': '/cars/paint/bmw-m2-f87--mineral-grey.jpg',
  'bmw-m2-f87:black-sapphire': '/cars/paint/bmw-m2-f87--black-sapphire.jpg',
}

export function paintImageKey(carId: string, colourId: string): string {
  return `${carId}:${colourId}`
}

/** Real photo for this car+colour, if we have one. */
export function resolvePaintPhoto(
  car: CarModel,
  colour: Colour,
): string | null {
  if (colour.image) return colour.image
  return paintImages[paintImageKey(car.id, colour.id)] ?? null
}
