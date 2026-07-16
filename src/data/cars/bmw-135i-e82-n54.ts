import type { CarModel } from '../../types/catalog'

/**
 * E82 135i N54 (US coupe, pre-LCI).
 * Factory: 300 hp, 300 lb-ft (407 Nm). Curb ~3,373 lb. 0–60 ~5.1 s (manual).
 * MSRP approx. when new (2008).
 */
export const bmw135iE82N54: CarModel = {
  id: 'bmw-135i-e82-n54',
  make: 'BMW',
  model: '135i',
  generation: 'E82',
  label: '135i N54',
  years: [2008, 2009, 2010],
  colours: [
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'jet-black', name: 'Jet Black', hex: '#0B0B0C' },
    { id: 'space-grey', name: 'Space Grey Metallic', hex: '#5C6168' },
    { id: 'montego-blue', name: 'Montego Blue Metallic', hex: '#1A3A5C' },
    { id: 'crimson-red', name: 'Crimson Red', hex: '#8B1A1A' },
    { id: 'titanium-silver', name: 'Titanium Silver Metallic', hex: '#C5C7CA' },
  ],
  basePrice: 35575,
  baseFigures: {
    hp: 300,
    torqueNm: 407,
    zeroToSixtySec: 5.1,
    weightKg: 1530,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'N54B30',
  },
  figuresSource: 'oem',
  euFiguresDelta: { zeroToSixtySec: 0.15 },
  description:
    'E82 1 Series Coupe 135i — twin-turbo N54B30 (2008–2010), the classic tuner motor.',
  image: '/cars/bmw-135i-e82.jpg',
  modTags: ['bmw', 'e82', '135i', 'n54', 'rwd', 'turbo'],
  specOptions: [
    {
      id: 'transmission',
      name: 'Transmission',
      required: false,
      choices: [
        { id: 'manual', name: '6-speed manual', price: 0, isDefault: true },
        {
          id: 'auto',
          name: '6-speed Steptronic automatic',
          price: 1275,
          figuresDelta: { weightKg: 30, zeroToSixtySec: 0.3 },
        },
      ],
    },
    {
      id: 'package',
      name: 'Package',
      required: false,
      choices: [
        { id: 'base', name: 'Base', price: 0, isDefault: true },
        { id: 'premium', name: 'Premium Package', price: 2100 },
        { id: 'sport', name: 'Sport Package', price: 1500 },
      ],
    },
  ],
}
