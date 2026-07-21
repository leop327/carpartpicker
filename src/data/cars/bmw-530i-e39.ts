import type { CarModel } from '../../types/catalog'
import {
  interiorTrim,
  parkingAndCameras,
  sunProtectionGlass,
} from './specHelpers'

/** E39 530i — M54B30 UK figures. */
export const bmw530iE39: CarModel = {
  id: 'bmw-530i-e39',
  make: 'BMW',
  series: '5 Series',
  model: '530i',
  generation: 'E39',
  label: '530i',
  years: [2000, 2001, 2002, 2003],
  colours: [
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'jet-black', name: 'Jet Black', hex: '#0B0B0C' },
    { id: 'titanium-silver', name: 'Titanium Silver Metallic', hex: '#C5C7CA' },
    { id: 'oxford-green', name: 'Oxford Green Metallic', hex: '#1A3A2C' },
    { id: 'orient-blue', name: 'Orient Blue Metallic', hex: '#1A3A5C' },
  ],
  basePrice: 32450,
  euBasePrice: 32450,
  baseFigures: {
    hp: 231,
    torqueNm: 300,
    zeroToSixtySec: 7.1,
    weightKg: 1610,
    drivetrain: 'RWD',
    engineSizeL: 3.0,
    engineCode: 'M54B30',
  },
  figuresSource: 'oem',
  description:
    'E39 530i — naturally aspirated M54B30 (UK: 231 PS / 300 Nm). The sweet six of the E39 range.',
  tagline: 'The everyday E39 that still sings.',
  image: '/cars/bmw-e60-5series.jpg',
  modTags: ['bmw', 'e39', '530i', 'm54', 'rwd', 'petrol'],
  specOptions: [
    {
      id: 'transmission',
      name: 'Transmission',
      required: true,
      choices: [
        { id: 'manual', name: '5-speed manual', price: 0, isDefault: true },
        {
          id: 'auto',
          name: '5-speed Steptronic',
          price: 1200,
          figuresDelta: { zeroToSixtySec: 0.3 },
        },
      ],
    },
    interiorTrim(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
