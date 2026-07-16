/**
 * Copy this file, fill it in, then register the export in `index.ts`.
 *
 * Figures tips:
 * - hp / torqueNm / zeroToSixtySec / weightKg from OEM or press kit when possible
 * - US 0–60 and DIN kerb weight can differ — pick one market and note it in the comment
 * - modTags should include engine code family (n54, n55, s55, b58) for mod matching
 */
import type { CarModel } from '../../types/catalog'

export const exampleCar: CarModel = {
  id: 'bmw-example',
  make: 'BMW',
  model: 'Example',
  generation: 'Exx',
  label: 'Example',
  years: [2020, 2021],
  colours: [
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
  ],
  basePrice: 50000,
  baseFigures: {
    hp: 300,
    torqueNm: 400,
    zeroToSixtySec: 5.0,
    weightKg: 1500,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'EXAMPLE',
  },
  figuresSource: 'oem',
  description: 'Short one-line description.',
  image: '/cars/bmw-135i-e82.jpg',
  modTags: ['bmw', 'example', 'rwd'],
  specOptions: [
    {
      id: 'transmission',
      name: 'Transmission',
      required: false,
      choices: [
        { id: 'manual', name: 'Manual', price: 0, isDefault: true },
        {
          id: 'auto',
          name: 'Automatic',
          price: 0,
          figuresDelta: { weightKg: 30, zeroToSixtySec: -0.1 },
        },
      ],
    },
  ],
}
