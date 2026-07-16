import type { Mod, ModCategory } from '../../types/catalog'

export const modCategories: ModCategory[] = [
  {
    id: 'exhaust',
    name: 'Exhaust',
    description: 'Cat-backs, downpipes, and axle-backs.',
  },
  {
    id: 'intake',
    name: 'Intake',
    description: 'Cold-air intakes and charge pipes.',
  },
  {
    id: 'forced-induction',
    name: 'Forced induction',
    description: 'Turbo upgrades and intercoolers.',
  },
  {
    id: 'ecu',
    name: 'ECU / tune',
    description: 'Flash tunes and flex-fuel.',
  },
  {
    id: 'suspension',
    name: 'Suspension',
    description: 'Coilovers, sway bars, bushings.',
  },
  {
    id: 'brakes',
    name: 'Brakes',
    description: 'Pads, rotors, big-brake kits.',
  },
  {
    id: 'wheels',
    name: 'Wheels & tyres',
    description: 'Lightweight wheels and sticky rubber.',
  },
  {
    id: 'aero',
    name: 'Aero',
    description: 'Spoilers, splitters, lips.',
  },
  {
    id: 'drivetrain',
    name: 'Drivetrain',
    description: 'Clutches, LSD, mounts.',
  },
  {
    id: 'interior',
    name: 'Interior',
    description: 'Seats, harnesses, weight reduction.',
  },
]

/** Street-price ballparks (USD) for N54 / N55 / S55 / B58 platforms. */
export const mods: Mod[] = [
  // N54
  {
    id: 'vrsf-dp-n54',
    name: '3" Race Downpipes',
    brand: 'VRSF',
    category: 'exhaust',
    price: 549,
    description: 'Catless / high-flow race downpipes for N54.',
    figuresDelta: { hp: 20, torqueNm: 30, zeroToSixtySec: -0.1 },
    compatibleTags: ['n54'],
  },
  {
    id: 'afe-momentum-n54',
    name: 'Momentum GT Intake',
    brand: 'aFe Power',
    category: 'intake',
    price: 399,
    description: 'Cold-air intake for N54 1/3 Series.',
    figuresDelta: { hp: 8, torqueNm: 10 },
    compatibleTags: ['n54', 'e82'],
  },
  {
    id: 'mhd-stage2-n54',
    name: 'Stage 2 + E85 Map',
    brand: 'MHD',
    category: 'ecu',
    price: 499,
    description: 'Flash tune popular on N54 — E85 blend maps.',
    figuresDelta: { hp: 80, torqueNm: 100, zeroToSixtySec: -0.35 },
    compatibleTags: ['n54'],
  },
  {
    id: 'pure-stage1-n54',
    name: 'Stage 1+ Twin Turbos',
    brand: 'Pure Turbos',
    category: 'forced-induction',
    price: 3200,
    description: 'Hybrid twin turbos — N54 staple upgrade.',
    figuresDelta: { hp: 120, torqueNm: 140, zeroToSixtySec: -0.45 },
    compatibleTags: ['n54'],
  },

  // N55 (135i LCI, M2, M235i)
  {
    id: 'vrsf-dp-n55',
    name: '3" Cast Downpipe',
    brand: 'VRSF',
    category: 'exhaust',
    price: 449,
    description: 'High-flow downpipe for N55.',
    figuresDelta: { hp: 15, torqueNm: 25, zeroToSixtySec: -0.08 },
    compatibleTags: ['n55'],
  },
  {
    id: 'mst-intake-n55',
    name: 'Turbo Inlet + Intake',
    brand: 'MST Performance',
    category: 'intake',
    price: 420,
    description: 'Inlet and intake kit for N55 platforms.',
    figuresDelta: { hp: 10, torqueNm: 12 },
    compatibleTags: ['n55'],
  },
  {
    id: 'bootmod3-stage1-n55',
    name: 'Stage 1 OTS Map',
    brand: 'bootmod3',
    category: 'ecu',
    price: 599,
    description: 'Stage 1 93 flash for N55.',
    figuresDelta: { hp: 50, torqueNm: 70, zeroToSixtySec: -0.2 },
    compatibleTags: ['n55'],
  },
  {
    id: 'mishimoto-ic-n55',
    name: 'Performance Intercooler',
    brand: 'Mishimoto',
    category: 'forced-induction',
    price: 750,
    description: 'Front-mount style cooler for N55 heat soak.',
    figuresDelta: { hp: 8, torqueNm: 12 },
    compatibleTags: ['n55', 'm2', 'm235i'],
  },

  // S55 M2C
  {
    id: 'akrapovic-evolution-s55',
    name: 'Evolution Line',
    brand: 'Akrapovič',
    category: 'exhaust',
    price: 5499,
    description: 'Titanium Evolution Line for S55 M cars.',
    figuresDelta: { hp: 12, torqueNm: 15, weightKg: -8, zeroToSixtySec: -0.05 },
    compatibleTags: ['s55', 'm2c'],
  },
  {
    id: 'eventuri-s55',
    name: 'Carbon Intake',
    brand: 'Eventuri',
    category: 'intake',
    price: 1895,
    description: 'Carbon intake for S55 F87/F8x.',
    figuresDelta: { hp: 15, torqueNm: 18 },
    compatibleTags: ['s55', 'm2c'],
  },
  {
    id: 'bootmod3-stage1-s55',
    name: 'Stage 1 93 Map',
    brand: 'bootmod3',
    category: 'ecu',
    price: 599,
    description: 'OTS Stage 1 for S55 M2 Competition.',
    figuresDelta: { hp: 60, torqueNm: 80, zeroToSixtySec: -0.2 },
    compatibleTags: ['s55', 'm2c'],
  },
  {
    id: 'pure-stage2-s55',
    name: 'Stage 2 Turbos',
    brand: 'Pure Turbos',
    category: 'forced-induction',
    price: 5499,
    description: 'Larger hybrid turbos for S55.',
    figuresDelta: { hp: 140, torqueNm: 160, zeroToSixtySec: -0.4 },
    compatibleTags: ['s55'],
  },

  // B58 M140i
  {
    id: 'vrsf-dp-b58',
    name: '3.5" Catless Downpipe',
    brand: 'VRSF',
    category: 'exhaust',
    price: 449,
    description: 'Downpipe for B58 F-series.',
    figuresDelta: { hp: 18, torqueNm: 28, zeroToSixtySec: -0.1 },
    compatibleTags: ['b58', 'm140i'],
  },
  {
    id: 'mst-intake-b58',
    name: 'V2 Intake',
    brand: 'MST Performance',
    category: 'intake',
    price: 399,
    description: 'Cold-air intake for B58 F20/F22/F30.',
    figuresDelta: { hp: 10, torqueNm: 14 },
    compatibleTags: ['b58', 'm140i'],
  },
  {
    id: 'bootmod3-stage1-b58',
    name: 'Stage 1 93 Map',
    brand: 'bootmod3',
    category: 'ecu',
    price: 599,
    description: 'Stage 1 flash — B58 wakes up hard.',
    figuresDelta: { hp: 70, torqueNm: 90, zeroToSixtySec: -0.3 },
    compatibleTags: ['b58', 'm140i'],
  },
  {
    id: 'mhd-flexfuel-b58',
    name: 'FlexFuel Kit + Map',
    brand: 'MHD',
    category: 'ecu',
    price: 899,
    description: 'E85 flex sensor kit and supporting maps.',
    figuresDelta: { hp: 100, torqueNm: 120, zeroToSixtySec: -0.4 },
    compatibleTags: ['b58'],
    conflictsWith: ['bootmod3-stage1-b58'],
  },

  // Shared chassis / wheels
  {
    id: 'kw-v3',
    name: 'V3 Coilover Kit',
    brand: 'KW Suspension',
    category: 'suspension',
    price: 2899,
    description: 'Independently adjustable compression & rebound.',
    figuresDelta: { weightKg: -2, zeroToSixtySec: -0.02 },
    compatibleTags: ['*'],
  },
  {
    id: 'apex-vs-5rs',
    name: 'VS-5RS (set)',
    brand: 'Apex Wheels',
    category: 'wheels',
    price: 1896,
    description: 'Flow-formed track wheels for BMW fitments.',
    figuresDelta: { weightKg: -8, zeroToSixtySec: -0.03 },
    compatibleTags: ['bmw'],
  },
  {
    id: 'michelin-ps4s',
    name: 'Pilot Sport 4S (set)',
    brand: 'Michelin',
    category: 'wheels',
    price: 1200,
    description: 'UHP summer tyre set.',
    figuresDelta: { zeroToSixtySec: -0.1 },
    compatibleTags: ['*'],
  },
  {
    id: 'brembo-gt-bbk',
    name: 'GT Big Brake Kit',
    brand: 'Brembo',
    category: 'brakes',
    price: 4599,
    description: '6-piston front BBK.',
    figuresDelta: { weightKg: 8 },
    compatibleTags: ['*'],
  },
  {
    id: 'act-clutch',
    name: 'Heavy-Duty Clutch Kit',
    brand: 'ACT',
    category: 'drivetrain',
    price: 875,
    description: 'Street/track clutch kit.',
    figuresDelta: { weightKg: -2 },
    compatibleTags: ['*'],
  },
  {
    id: 'carbon-front-lip',
    name: 'Carbon Front Lip',
    brand: 'Various',
    category: 'aero',
    price: 650,
    description: 'Dry carbon front lip.',
    figuresDelta: { weightKg: -1 },
    compatibleTags: ['*'],
  },
]

export function getModById(id: string): Mod | undefined {
  return mods.find((mod) => mod.id === id)
}

export function getModsForCar(modTags: string[]): Mod[] {
  return mods.filter((mod) => {
    if (mod.compatibleTags.includes('*') || mod.compatibleTags.length === 0) {
      return true
    }
    return mod.compatibleTags.some((tag) => modTags.includes(tag))
  })
}
