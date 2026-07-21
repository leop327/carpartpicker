import type { CarModel } from '../../types/catalog'
import {
  f87Brakes,
  f87FixedSuspension,
  f87Seats,
  f87Wheels,
  interiorTrim,
  mDctTransmission,
  mDriversPackage,
  parkingAndCameras,
  sunProtectionGlass,
} from './specHelpers'

/**
 * F87 M2 — BMW UK figures.
 * No factory Adaptive suspension or carbon ceramics (those arrived with M2 CS only).
 */
export const bmwM2F87: CarModel = {
  id: 'bmw-m2-f87',
  make: 'BMW',
  series: '2 Series',
  model: 'M2',
  generation: 'F87',
  label: 'M2',
  years: [2016, 2017, 2018],
  colours: [
    { id: 'long-beach-blue', name: 'Long Beach Blue Metallic', hex: '#1A4F8C' },
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'mineral-grey', name: 'Mineral Grey Metallic', hex: '#6B6E73' },
    { id: 'antigua-blue', name: 'Antigua Blue Metallic', hex: '#2C5278' },
  ],
  basePrice: 44525,
  baseFigures: {
    hp: 370,
    torqueNm: 465,
    zeroToSixtySec: 4.3,
    weightKg: 1495,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'N55B30T0',
  },
  figuresSource: 'oem',
  yearFigures: {
    2018: { weightKg: 5 },
  },
  description:
    'F87 M2 — high-output N55B30T0 (UK: 370 PS / 465 Nm), Active M Differential. Fixed M Sport suspension from the factory.',
  tagline: 'Compact, angry, and properly M.',
  image: '/cars/bmw-m2-f87.jpg',
  modTags: ['bmw', 'm2', 'f87', 'n55', 'rwd', 'turbo'],
  specOptions: [
    mDctTransmission(-0.2),
    f87FixedSuspension('M Sport suspension (standard)'),
    f87Seats(false),
    f87Wheels(false),
    f87Brakes(),
    interiorTrim({}),
    mDriversPackage(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
