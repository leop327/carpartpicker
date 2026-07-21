import type { CarModel } from '../../types/catalog'
import {
  interiorTrim,
  parkingAndCameras,
  sunProtectionGlass,
} from './specHelpers'

/** E53 X5 3.0i — M54B30. */
export const bmwX5E5330i: CarModel = {
  id: 'bmw-x5-e53-30i',
  make: 'BMW',
  series: 'X5',
  model: 'X5',
  generation: 'E53',
  label: 'X5 3.0i',
  years: [2000, 2001, 2002, 2003, 2004, 2005, 2006],
  colours: [
    { id: 'alpine-white', name: 'Alpine White', hex: '#F4F4F2' },
    { id: 'jet-black', name: 'Jet Black', hex: '#0B0B0C' },
    { id: 'titanium-silver', name: 'Titanium Silver Metallic', hex: '#C5C7CA' },
    { id: 'orient-blue', name: 'Orient Blue Metallic', hex: '#1A3A5C' },
    { id: 'toffee', name: 'Toffee Metallic', hex: '#6B4E3D' },
  ],
  basePrice: 38950,
  euBasePrice: 38950,
  baseFigures: {
    hp: 231,
    torqueNm: 300,
    zeroToSixtySec: 8.5,
    weightKg: 2070,
    drivetrain: 'AWD',
    engineSizeL: 3.0,
    engineCode: 'M54B30',
  },
  figuresSource: 'oem',
  description:
    'E53 X5 3.0i — M54B30 petrol (UK: 231 PS / 300 Nm), xDrive AWD. The original SAV.',
  tagline: 'The one that started the SAV boom.',
  image: '/cars/bmw-e70-x5.jpg',
  modTags: ['bmw', 'e53', 'x5', 'm54', 'awd', 'xdrive', 'petrol'],
  specOptions: [
    {
      id: 'transmission',
      name: 'Transmission',
      required: true,
      choices: [
        {
          id: 'auto',
          name: '5-speed Steptronic',
          price: 0,
          isDefault: true,
        },
      ],
    },
    interiorTrim(),
    parkingAndCameras(),
    sunProtectionGlass(),
  ],
}
