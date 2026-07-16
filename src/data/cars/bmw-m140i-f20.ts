import type { CarModel } from '../../types/catalog'

/**
 * F20/F21 M140i (UK/EU — B58).
 * Factory: 340 hp (252 kW), 500 Nm. 0–62 mph ~4.6–4.8 s depending on transmission/drivetrain.
 * DIN kerb weight typically ~1,485–1,550 kg; RWD Steptronic ~1,510 kg used here.
 */
export const bmwM140iF20: CarModel = {
  id: 'bmw-m140i-f20',
  make: 'BMW',
  model: 'M140i',
  generation: 'F20',
  label: 'M140i',
  years: [2016, 2017, 2018, 2019],
  colours: [
    { id: 'estoril-blue', name: 'Estoril Blue Metallic', hex: '#1E4D8C' },
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'black-sapphire', name: 'Black Sapphire Metallic', hex: '#0B0B0C' },
    { id: 'mineral-grey', name: 'Mineral Grey Metallic', hex: '#6B6E73' },
    { id: 'melbourne-red', name: 'Melbourne Red Metallic', hex: '#A81C23' },
  ],
  basePrice: 35570,
  baseFigures: {
    hp: 340,
    torqueNm: 500,
    zeroToSixtySec: 4.6,
    weightKg: 1510,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'B58B30M0',
  },
  figuresSource: 'oem',
  euBasePrice: 35570,
  euFiguresDelta: { zeroToSixtySec: 0.1 },
  yearFigures: {
    2019: { weightKg: 10 },
  },
  description:
    'F20/F21 M140i — B58B30M0 straight-six hot hatch (UK/EU markets).',
  image: '/cars/bmw-m140i-f20.jpg',
  modTags: ['bmw', 'm140i', 'f20', 'b58', 'rwd', 'turbo'],
  specOptions: [
    {
      id: 'transmission',
      name: 'Transmission',
      required: false,
      choices: [
        {
          id: 'auto',
          name: '8-speed Steptronic',
          price: 0,
          isDefault: true,
        },
        {
          id: 'manual',
          name: '6-speed manual',
          price: 0,
          figuresDelta: { weightKg: -25, zeroToSixtySec: 0.2 },
        },
      ],
    },
    {
      id: 'xdrive',
      name: 'Drivetrain',
      required: false,
      choices: [
        { id: 'rwd', name: 'RWD', price: 0, isDefault: true },
        {
          id: 'xdrive',
          name: 'xDrive AWD',
          price: 2000,
          figuresDelta: {
            drivetrain: 'AWD',
            weightKg: 75,
            zeroToSixtySec: -0.2,
          },
        },
      ],
    },
  ],
}
