import type { CarModel } from '../../types/catalog'
import {
  interiorTrim,
  parkingAndCameras,
  sunProtectionGlass,
} from './specHelpers'

/** E39 M5 — S62B50 UK figures. */
export const bmwM5E39: CarModel = {
  id: 'bmw-m5-e39',
  make: 'BMW',
  series: '5 Series',
  model: 'M5',
  generation: 'E39',
  label: 'M5',
  years: [1999, 2000, 2001, 2002, 2003],
  colours: [
    { id: 'imola-red', name: 'Imola Red', hex: '#A81C23' },
    { id: 'carbon-black', name: 'Carbon Black Metallic', hex: '#1A1A1C' },
    { id: 'titanium-silver', name: 'Titanium Silver Metallic', hex: '#C5C7CA' },
    { id: 'le-mans-blue', name: 'Le Mans Blue Metallic', hex: '#1E4D8C' },
    { id: 'oxford-green', name: 'Oxford Green Metallic', hex: '#1A3A2C' },
  ],
  basePrice: 58950,
  euBasePrice: 58950,
  baseFigures: {
    hp: 400,
    torqueNm: 500,
    zeroToSixtySec: 5.3,
    weightKg: 1795,
    drivetrain: 'RWD',
    engineSizeL: 4.9,
    engineCode: 'S62B50',
  },
  figuresSource: 'oem',
  description:
    'E39 M5 — 4.9-litre S62 V8 (UK: 400 PS / 500 Nm), 6-speed manual only. Still the cult saloon.',
  tagline: 'The last pure manual M5.',
  image: '/cars/bmw-e60-m5.jpg',
  modTags: ['bmw', 'e39', 'm5', 's62', 'rwd', 'petrol', 'v8'],
  specOptions: [
    {
      id: 'transmission',
      name: 'Transmission',
      required: true,
      choices: [
        {
          id: 'manual',
          name: '6-speed manual',
          price: 0,
          isDefault: true,
          description: 'Only gearbox offered.',
        },
      ],
    },
    interiorTrim({ merinoStandard: true }),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
