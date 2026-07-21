import type {
  CarModel,
  Colour,
  Drivetrain,
  Figures,
  SpecOptionGroup,
} from '../../types/catalog'
import {
  adaptiveMSportSuspension,
  e82MSportPackage,
  e82Suspension,
  e82Transmission,
  f87Brakes,
  f87FixedSuspension,
  f87Seats,
  f87Wheels,
  f8xAdaptiveStandard,
  f8xBrakes,
  f8xCarbonRoofStandard,
  f8xSeats,
  f8xWheels,
  interiorTrim,
  mDctTransmission,
  mDriversPackage,
  mSportBrakesOption,
  parkingAndCameras,
  stepTronicTransmission,
  sunProtectionGlass,
} from './specHelpers'

export const bmwColours: Colour[] = [
  { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
  { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
  { id: 'mineral-grey', name: 'Mineral Grey Metallic', hex: '#6B6E73' },
  { id: 'melbourne-red', name: 'Melbourne Red Metallic', hex: '#A81C23' },
  { id: 'estoril-blue', name: 'Estoril Blue Metallic', hex: '#1E4D8C' },
  { id: 'portimao-blue', name: 'Portimao Blue Metallic', hex: '#1B4F8C' },
  { id: 'yas-marina-blue', name: 'Yas Marina Blue Metallic', hex: '#1B4F72' },
  { id: 'sakhir-orange', name: 'Sakhir Orange Metallic', hex: '#C45A1A' },
  { id: 'brooklyn-grey', name: 'Brooklyn Grey Metallic', hex: '#6B6E73' },
  { id: 'silverstone', name: 'Silverstone Metallic', hex: '#A8ADB4' },
]

/** Chassis → local photo (shared across variants on that chassis). */
export const chassisImage: Record<string, string> = {
  E34: '/cars/bmw-e60-5series.jpg',
  E36: '/cars/bmw-e46-m3.jpg',
  E38: '/cars/bmw-g11-7series.jpg',
  E39: '/cars/bmw-e60-5series.jpg',
  E53: '/cars/bmw-e70-x5.jpg',
  E46: '/cars/bmw-e46-m3.jpg',
  E52: '/cars/bmw-e85-z4.jpg',
  E60: '/cars/bmw-e60-5series.jpg',
  E61: '/cars/bmw-e60-5series.jpg',
  E63: '/cars/bmw-e63-6series.jpg',
  E64: '/cars/bmw-e63-6series.jpg',
  E65: '/cars/bmw-g11-7series.jpg',
  E70: '/cars/bmw-e70-x5.jpg',
  E71: '/cars/bmw-e71-x6.jpg',
  E81: '/cars/bmw-e87-1series.jpg',
  E82: '/cars/bmw-135i-e82.jpg',
  E83: '/cars/bmw-f25-x3.jpg',
  E84: '/cars/bmw-f25-x3.jpg',
  E85: '/cars/bmw-e85-z4.jpg',
  E86: '/cars/bmw-e85-z4.jpg',
  E87: '/cars/bmw-e87-1series.jpg',
  E88: '/cars/bmw-135i-e82.jpg',
  E89: '/cars/bmw-e89-z4.jpg',
  E90: '/cars/bmw-e90-3series.jpg',
  E91: '/cars/bmw-e90-3series.jpg',
  E92: '/cars/bmw-335i-e92.jpg',
  E93: '/cars/bmw-335i-e92.jpg',
  'E36/7': '/cars/bmw-e85-z4.jpg',
  F01: '/cars/bmw-g11-7series.jpg',
  F06: '/cars/bmw-f06-6series.jpg',
  F07: '/cars/bmw-540i-g30.jpg',
  F10: '/cars/bmw-535i-f10.jpg',
  F11: '/cars/bmw-535i-f10.jpg',
  F12: '/cars/bmw-f12-6series.jpg',
  F13: '/cars/bmw-f13-m6.jpg',
  F15: '/cars/bmw-f15-x5.jpg',
  F16: '/cars/bmw-f26-x4.jpg',
  F20: '/cars/bmw-m140i-f20.jpg',
  'F20/F21': '/cars/bmw-m140i-f20.jpg',
  F22: '/cars/bmw-m235i-f22.jpg',
  F23: '/cars/bmw-m235i-f22.jpg',
  F25: '/cars/bmw-f25-x3.jpg',
  F26: '/cars/bmw-f26-x4.jpg',
  F30: '/cars/bmw-340i-f30.jpg',
  F31: '/cars/bmw-340i-f30.jpg',
  F32: '/cars/bmw-435i-f32.jpg',
  F33: '/cars/bmw-435i-f32.jpg',
  F34: '/cars/bmw-340i-f30.jpg',
  F36: '/cars/bmw-440i-f32.jpg',
  F80: '/cars/bmw-m3-f80.jpg',
  F82: '/cars/bmw-m4-f82.jpg',
  F83: '/cars/bmw-m4-f82.jpg',
  F85: '/cars/bmw-f15-x5.jpg',
  F86: '/cars/bmw-g06-x6.jpg',
  F87: '/cars/bmw-m2-f87.jpg',
  F90: '/cars/bmw-f90-m5.jpg',
  F91: '/cars/bmw-g15-8series.jpg',
  F92: '/cars/bmw-g15-8series.jpg',
  F93: '/cars/bmw-g15-8series.jpg',
  F95: '/cars/bmw-g05-x5.jpg',
  F96: '/cars/bmw-g06-x6.jpg',
  F97: '/cars/bmw-x3-m40i-g01.jpg',
  F98: '/cars/bmw-g02-x4.jpg',
  G01: '/cars/bmw-x3-m40i-g01.jpg',
  G02: '/cars/bmw-g02-x4.jpg',
  G05: '/cars/bmw-g05-x5.jpg',
  G06: '/cars/bmw-g06-x6.jpg',
  G07: '/cars/bmw-g05-x5.jpg',
  G09: '/cars/bmw-g05-x5.jpg',
  G11: '/cars/bmw-g11-7series.jpg',
  G12: '/cars/bmw-g11-7series.jpg',
  G14: '/cars/bmw-g15-8series.jpg',
  G15: '/cars/bmw-g15-8series.jpg',
  G16: '/cars/bmw-g15-8series.jpg',
  G20: '/cars/bmw-m340i-g20.jpg',
  G21: '/cars/bmw-m340i-g20.jpg',
  G22: '/cars/bmw-g22-4series.jpg',
  G23: '/cars/bmw-g22-4series.jpg',
  G26: '/cars/bmw-g22-4series.jpg',
  G29: '/cars/bmw-z4-m40i-g29.jpg',
  G30: '/cars/bmw-540i-g30.jpg',
  G31: '/cars/bmw-540i-g30.jpg',
  G32: '/cars/bmw-g32-6gt.jpg',
  G42: '/cars/bmw-m240i-g42.jpg',
  G45: '/cars/bmw-x3-m40i-g01.jpg',
  G60: '/cars/bmw-540i-g30.jpg',
  G61: '/cars/bmw-540i-g30.jpg',
  G70: '/cars/bmw-g11-7series.jpg',
  G80: '/cars/bmw-g80-m3.jpg',
  G81: '/cars/bmw-g80-m3.jpg',
  G82: '/cars/bmw-g82-m4.jpg',
  G83: '/cars/bmw-g82-m4.jpg',
  G87: '/cars/bmw-g87-m2.jpg',
  G90: '/cars/bmw-f90-m5.jpg',
  G99: '/cars/bmw-f90-m5.jpg',
  E28: '/cars/bmw-e60-m5.jpg',
  E31: '/cars/bmw-g15-8series.jpg',
  'E36/8': '/cars/bmw-e85-z4.jpg',
}

type SpecPack = 'e82' | 'street' | 'm-f8x' | 'm-f87' | 'auto-only'

export type FleetDef = {
  id: string
  series: string
  model: string
  generation: string
  label: string
  years: [number, number] | number[]
  price: number
  hp: number
  tq: number
  zero: number
  kg: number
  drive?: Drivetrain
  engine: string
  /** Defaults to 3.0. Catalog is 3.0L+ only. */
  litres?: number
  /** Defaults to petrol. */
  fuel?: 'petrol' | 'diesel'
  tags: string[]
  tagline: string
  desc?: string
  pack?: SpecPack
  image?: string
}

function yearList(years: [number, number] | number[]): number[] {
  if (
    years.length === 2 &&
    years[0]! > 1900 &&
    years[1]! >= years[0]! &&
    years[1]! - years[0]! < 30
  ) {
    const [a, b] = years as [number, number]
    return Array.from({ length: b - a + 1 }, (_, i) => a + i)
  }
  return [...new Set(years)]
}

function packFor(def: FleetDef): SpecOptionGroup[] {
  const pack = def.pack ?? 'street'
  if (pack === 'e82') {
    return [
      e82Transmission(def.engine.startsWith('N55')),
      e82MSportPackage(),
      e82Suspension(),
      parkingAndCameras(),
      sunProtectionGlass(),
    ]
  }
  if (pack === 'm-f8x') {
    return [
      mDctTransmission(-0.2),
      f8xAdaptiveStandard(),
      f8xCarbonRoofStandard(),
      f8xSeats(),
      f8xWheels(),
      f8xBrakes(),
      interiorTrim({ merinoStandard: true }),
      mDriversPackage(),
      parkingAndCameras(),
      sunProtectionGlass(),
    ]
  }
  if (pack === 'm-f87') {
    return [
      mDctTransmission(-0.2),
      f87FixedSuspension(),
      f87Seats(def.model.includes('Competition') || def.model.includes('CS')),
      f87Wheels(def.model.includes('Competition') || def.model.includes('CS')),
      f87Brakes(),
      interiorTrim({ carbonStandard: def.model.includes('Competition') }),
      mDriversPackage(),
      parkingAndCameras(),
      sunProtectionGlass(),
    ]
  }
  if (pack === 'auto-only') {
    return [
      {
        id: 'transmission',
        name: 'Transmission',
        required: false,
        choices: [
          {
            id: 'auto',
            name: '8-speed Steptronic automatic',
            price: 0,
            isDefault: true,
          },
        ],
      },
      adaptiveMSportSuspension(),
      mSportBrakesOption(),
      parkingAndCameras(),
      sunProtectionGlass(),
    ]
  }
  return [
    stepTronicTransmission({
      autoDefault: true,
      manualWeightDelta: -25,
      manualZeroToSixtyDelta: 0.2,
    }),
    adaptiveMSportSuspension(),
    mSportBrakesOption(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ]
}

export function defineFleetCar(def: FleetDef): CarModel {
  const litres = def.litres ?? 3.0
  if (litres < 3.0) {
    throw new Error(`Fleet car ${def.id} is under 3.0L (${litres}) — not allowed`)
  }
  const years = yearList(def.years)
  const drive = def.drive ?? 'RWD'
  const fuel = def.fuel ?? 'petrol'
  const figures: Figures = {
    hp: def.hp,
    torqueNm: def.tq,
    zeroToSixtySec: def.zero,
    weightKg: def.kg,
    drivetrain: drive,
    engineSizeL: litres,
    engineCode: def.engine,
  }
  const fallbacks: Record<string, string> = {
    E93: '/cars/bmw-335i-e92.jpg',
    F12: '/cars/bmw-e63-6series.jpg',
    F15: '/cars/bmw-g05-x5.jpg',
    E89: '/cars/bmw-e85-z4.jpg',
    G06: '/cars/bmw-e71-x6.jpg',
  }
  const image =
    def.image ??
    chassisImage[def.generation] ??
    fallbacks[def.generation] ??
    '/cars/bmw-335i-e92.jpg'
  const fuelTags = fuel === 'diesel' ? ['diesel'] : ['petrol']
  return {
    id: def.id,
    make: 'BMW',
    series: def.series,
    model: def.model,
    generation: def.generation,
    label: def.label,
    years,
    colours: bmwColours,
    basePrice: def.price,
    euBasePrice: def.price,
    baseFigures: figures,
  figuresSource: 'estimated',
    description:
      def.desc ??
      `${def.generation} ${def.label} — ${def.engine} ${fuel} (~${def.hp} PS / ${def.tq} Nm). Figures are brochure estimates — verify against your market.`,
    tagline: def.tagline,
    image,
    modTags: ['bmw', ...fuelTags, ...def.tags],
    specOptions: packFor(def),
  }
}
