import type { Mod, ModCategory, StagePreset } from '../../types/catalog'

export const modCategories: ModCategory[] = [
  {
    id: 'exhaust',
    name: 'Exhaust',
    description: 'Cat-backs, downpipes, and mid-pipes.',
  },
  {
    id: 'intake',
    name: 'Intake',
    description: 'Cold-air intakes, inlets, and charge pipes.',
  },
  {
    id: 'forced-induction',
    name: 'Forced induction',
    description: 'Turbos, intercoolers, and supporting hardware.',
  },
  {
    id: 'ecu',
    name: 'ECU / tune',
    description: 'Flash tunes — only one active map at a time.',
  },
  {
    id: 'fueling',
    name: 'Fueling',
    description: 'HPFP, LPFP, injectors, and flex kits.',
  },
  {
    id: 'suspension',
    name: 'Suspension',
    description: 'Coilovers, sway bars, bushings, mounts.',
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
    description: 'Clutches, LSD, axles, mounts.',
  },
  {
    id: 'interior',
    name: 'Interior',
    description: 'Seats, harnesses, weight reduction.',
  },
]

/** Street-price ballparks (USD) for N54 / N55 / S55 / B58 platforms. */
export const mods: Mod[] = [
  // —— N54 ——
  {
    id: 'vrsf-dp-n54',
    name: '3" Race Downpipes',
    brand: 'VRSF',
    category: 'exhaust',
    price: 549,
    description: 'Catless / high-flow race downpipes for N54.',
    figuresDelta: { hp: 20, torqueNm: 30, zeroToSixtySec: -0.1 },
    figuresSource: 'tuner',
    compatibleTags: ['n54'],
  },
  {
    id: 'vrsf-catback-n54',
    name: '3" Cat-Back',
    brand: 'VRSF',
    category: 'exhaust',
    price: 799,
    description: 'Stainless cat-back for E8x/E9x N54.',
    figuresDelta: { hp: 6, torqueNm: 8, weightKg: -4 },
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
    id: 'vrsf-chargepipe-n54',
    name: 'Chargepipe',
    brand: 'VRSF',
    category: 'intake',
    price: 189,
    description: 'Aluminum chargepipe — common N54 supporting mod.',
    figuresDelta: { hp: 2 },
    compatibleTags: ['n54'],
  },
  {
    id: 'mhd-stage1-n54',
    name: 'Stage 1 93 Map',
    brand: 'MHD',
    category: 'ecu',
    price: 399,
    description: 'OTS Stage 1 flash for N54 on pump fuel.',
    figuresDelta: { hp: 45, torqueNm: 60, zeroToSixtySec: -0.2 },
    figuresSource: 'tuner',
    compatibleTags: ['n54'],
    conflictGroup: 'ecu-tune',
  },
  {
    id: 'mhd-stage2-n54',
    name: 'Stage 2 + E85 Map',
    brand: 'MHD',
    category: 'ecu',
    price: 499,
    description: 'Stage 2 flash — E85 blend maps common on N54.',
    figuresDelta: { hp: 80, torqueNm: 100, zeroToSixtySec: -0.35 },
    figuresSource: 'tuner',
    compatibleTags: ['n54'],
    conflictGroup: 'ecu-tune',
  },
  {
    id: 'pure-stage1-n54',
    name: 'Stage 1+ Twin Turbos',
    brand: 'Pure Turbos',
    category: 'forced-induction',
    price: 3200,
    description: 'Hybrid twin turbos — N54 staple upgrade.',
    figuresDelta: { hp: 120, torqueNm: 140, zeroToSixtySec: -0.45 },
    figuresSource: 'tuner',
    compatibleTags: ['n54'],
    conflictGroup: 'turbo-upgrade',
  },
  {
    id: 'vrsf-fmic-n54',
    name: '7" FMIC',
    brand: 'VRSF',
    category: 'forced-induction',
    price: 549,
    description: 'Front-mount intercooler for heat-soak control.',
    figuresDelta: { hp: 10, torqueNm: 15 },
    compatibleTags: ['n54'],
  },
  {
    id: 'autotech-hpfp-n54',
    name: 'HPFP Upgrade Internals',
    brand: 'Autotech',
    category: 'fueling',
    price: 549,
    description: 'High-pressure fuel pump internals — required for serious E85.',
    figuresDelta: {},
    compatibleTags: ['n54'],
  },
  {
    id: 'index12-injectors-n54',
    name: 'Index 12 Injectors',
    brand: 'BMW / rebuilt',
    category: 'fueling',
    price: 650,
    description: 'Higher-flow injectors for E85 / boosted N54 setups.',
    figuresDelta: {},
    compatibleTags: ['n54'],
  },

  // —— N55 ——
  {
    id: 'vrsf-dp-n55',
    name: '3" Cast Downpipe',
    brand: 'VRSF',
    category: 'exhaust',
    price: 449,
    description: 'High-flow downpipe for N55.',
    figuresDelta: { hp: 15, torqueNm: 25, zeroToSixtySec: -0.08 },
    figuresSource: 'tuner',
    compatibleTags: ['n55'],
  },
  {
    id: 'awe-touring-n55',
    name: 'Touring Edition Cat-Back',
    brand: 'AWE Tuning',
    category: 'exhaust',
    price: 1595,
    description: 'Resonated cat-back for N55 chassis.',
    figuresDelta: { hp: 5, torqueNm: 7, weightKg: -3 },
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
    id: 'vrsf-chargepipe-n55',
    name: 'Chargepipe',
    brand: 'VRSF',
    category: 'intake',
    price: 199,
    description: 'Aluminum chargepipe for N55.',
    figuresDelta: { hp: 2 },
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
    figuresSource: 'tuner',
    compatibleTags: ['n55'],
    conflictGroup: 'ecu-tune',
  },
  {
    id: 'bootmod3-stage2-n55',
    name: 'Stage 2 OTS Map',
    brand: 'bootmod3',
    category: 'ecu',
    price: 699,
    description: 'Stage 2 map assuming downpipe + intake.',
    figuresDelta: { hp: 75, torqueNm: 95, zeroToSixtySec: -0.28 },
    figuresSource: 'tuner',
    compatibleTags: ['n55'],
    conflictGroup: 'ecu-tune',
  },
  {
    id: 'mishimoto-ic-n55',
    name: 'Performance Intercooler',
    brand: 'Mishimoto',
    category: 'forced-induction',
    price: 750,
    description: 'Larger cooler for N55 heat soak.',
    figuresDelta: { hp: 8, torqueNm: 12 },
    compatibleTags: ['n55', 'm2', 'm235i'],
  },
  {
    id: 'pure-stage1-n55',
    name: 'Stage 1 Hybrid Turbo',
    brand: 'Pure Turbos',
    category: 'forced-induction',
    price: 2800,
    description: 'Hybrid turbo upgrade path for N55.',
    figuresDelta: { hp: 90, torqueNm: 110, zeroToSixtySec: -0.35 },
    figuresSource: 'tuner',
    compatibleTags: ['n55'],
    conflictGroup: 'turbo-upgrade',
  },
  {
    id: 'doc-race-hpfp-n55',
    name: 'HPFP Upgrade',
    brand: 'Dorch Engineering',
    category: 'fueling',
    price: 1295,
    description: 'High-flow HPFP for E85 / big turbo N55.',
    figuresDelta: {},
    compatibleTags: ['n55'],
  },

  // —— S55 ——
  {
    id: 'akrapovic-evolution-s55',
    name: 'Evolution Line',
    brand: 'Akrapovič',
    category: 'exhaust',
    price: 5499,
    description: 'Titanium Evolution Line for S55 M cars.',
    figuresDelta: { hp: 12, torqueNm: 15, weightKg: -8, zeroToSixtySec: -0.05 },
    figuresSource: 'tuner',
    compatibleTags: ['s55', 'm2c'],
  },
  {
    id: 'dinan-axleback-s55',
    name: 'Axle-Back Exhaust',
    brand: 'Dinan',
    category: 'exhaust',
    price: 1899,
    description: 'Axle-back for F87 M2 Competition.',
    figuresDelta: { hp: 4, torqueNm: 5, weightKg: -3 },
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
    figuresSource: 'tuner',
    compatibleTags: ['s55', 'm2c'],
  },
  {
    id: 'vrsf-chargepipe-s55',
    name: 'Chargepipe Kit',
    brand: 'VRSF',
    category: 'intake',
    price: 349,
    description: 'Chargepipes for S55 twin-turbo layout.',
    figuresDelta: { hp: 3 },
    compatibleTags: ['s55'],
  },
  {
    id: 'bootmod3-stage1-s55',
    name: 'Stage 1 93 Map',
    brand: 'bootmod3',
    category: 'ecu',
    price: 599,
    description: 'OTS Stage 1 for S55 M2 Competition.',
    figuresDelta: { hp: 60, torqueNm: 80, zeroToSixtySec: -0.2 },
    figuresSource: 'tuner',
    compatibleTags: ['s55', 'm2c'],
    conflictGroup: 'ecu-tune',
  },
  {
    id: 'bootmod3-stage2-s55',
    name: 'Stage 2 93 Map',
    brand: 'bootmod3',
    category: 'ecu',
    price: 699,
    description: 'Stage 2 assuming downpipes / intake support.',
    figuresDelta: { hp: 90, torqueNm: 110, zeroToSixtySec: -0.3 },
    figuresSource: 'tuner',
    compatibleTags: ['s55', 'm2c'],
    conflictGroup: 'ecu-tune',
  },
  {
    id: 'pure-stage2-s55',
    name: 'Stage 2 Turbos',
    brand: 'Pure Turbos',
    category: 'forced-induction',
    price: 5499,
    description: 'Larger hybrid turbos for S55.',
    figuresDelta: { hp: 140, torqueNm: 160, zeroToSixtySec: -0.4 },
    figuresSource: 'tuner',
    compatibleTags: ['s55'],
    conflictGroup: 'turbo-upgrade',
  },
  {
    id: 'csf-ic-s55',
    name: 'Triple-Pass Intercooler',
    brand: 'CSF',
    category: 'forced-induction',
    price: 999,
    description: 'High-capacity cooler for S55.',
    figuresDelta: { hp: 10, torqueNm: 14 },
    compatibleTags: ['s55', 'm2c'],
  },
  {
    id: 'doc-race-hpfp-s55',
    name: 'Stage 2 HPFP',
    brand: 'Dorch Engineering',
    category: 'fueling',
    price: 1895,
    description: 'HPFP upgrade for E85 / Stage 2+ S55.',
    figuresDelta: {},
    compatibleTags: ['s55'],
  },

  // —— B58 ——
  {
    id: 'vrsf-dp-b58',
    name: '3.5" Catless Downpipe',
    brand: 'VRSF',
    category: 'exhaust',
    price: 449,
    description: 'Downpipe for B58 F-series.',
    figuresDelta: { hp: 18, torqueNm: 28, zeroToSixtySec: -0.1 },
    figuresSource: 'tuner',
    compatibleTags: ['b58', 'm140i'],
  },
  {
    id: 'awe-track-b58',
    name: 'Track Edition Cat-Back',
    brand: 'AWE Tuning',
    category: 'exhaust',
    price: 1495,
    description: 'Louder track-oriented cat-back for B58.',
    figuresDelta: { hp: 6, torqueNm: 8, weightKg: -4 },
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
    id: 'vrsf-chargepipe-b58',
    name: 'Chargepipe',
    brand: 'VRSF',
    category: 'intake',
    price: 229,
    description: 'Aluminum chargepipe for B58.',
    figuresDelta: { hp: 2 },
    compatibleTags: ['b58'],
  },
  {
    id: 'bootmod3-stage1-b58',
    name: 'Stage 1 93 Map',
    brand: 'bootmod3',
    category: 'ecu',
    price: 599,
    description: 'Stage 1 flash — B58 wakes up hard on pump gas.',
    figuresDelta: { hp: 70, torqueNm: 90, zeroToSixtySec: -0.3 },
    figuresSource: 'tuner',
    compatibleTags: ['b58', 'm140i'],
    conflictGroup: 'ecu-tune',
  },
  {
    id: 'bootmod3-stage2-b58',
    name: 'Stage 2 93 Map',
    brand: 'bootmod3',
    category: 'ecu',
    price: 699,
    description: 'Stage 2 with DP / intake support assumed.',
    figuresDelta: { hp: 95, torqueNm: 115, zeroToSixtySec: -0.35 },
    figuresSource: 'tuner',
    compatibleTags: ['b58', 'm140i'],
    conflictGroup: 'ecu-tune',
  },
  {
    id: 'mhd-flexfuel-b58',
    name: 'FlexFuel Kit + Map',
    brand: 'MHD',
    category: 'ecu',
    price: 899,
    description: 'E85 flex sensor kit and supporting maps.',
    figuresDelta: { hp: 100, torqueNm: 120, zeroToSixtySec: -0.4 },
    figuresSource: 'tuner',
    compatibleTags: ['b58'],
    conflictGroup: 'ecu-tune',
  },
  {
    id: 'vrsf-fmic-b58',
    name: '5" FMIC',
    brand: 'VRSF',
    category: 'forced-induction',
    price: 499,
    description: 'Front-mount cooler popular on B58.',
    figuresDelta: { hp: 8, torqueNm: 12 },
    compatibleTags: ['b58', 'm140i'],
  },
  {
    id: 'pure-stage1-b58',
    name: 'Stage 1 Hybrid Turbo',
    brand: 'Pure Turbos',
    category: 'forced-induction',
    price: 3200,
    description: 'Hybrid turbo for big-power B58 builds.',
    figuresDelta: { hp: 130, torqueNm: 150, zeroToSixtySec: -0.45 },
    figuresSource: 'tuner',
    compatibleTags: ['b58'],
    conflictGroup: 'turbo-upgrade',
  },
  {
    id: 'doc-race-hpfp-b58',
    name: 'HPFP Upgrade',
    brand: 'Dorch Engineering',
    category: 'fueling',
    price: 1495,
    description: 'HPFP for E85 / Stage 2+ B58.',
    figuresDelta: {},
    compatibleTags: ['b58'],
  },

  // —— Shared chassis ——
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
    id: 'bc-br-coilovers',
    name: 'BR Series Coilovers',
    brand: 'BC Racing',
    category: 'suspension',
    price: 1295,
    description: 'Street/track coilovers — value option.',
    figuresDelta: { weightKg: -1 },
    compatibleTags: ['*'],
    conflictsWith: ['kw-v3'],
  },
  {
    id: 'whiteline-sway',
    name: 'Front & Rear Sway Bar Kit',
    brand: 'Whiteline',
    category: 'suspension',
    price: 549,
    description: 'Adjustable sway bars for sharper response.',
    figuresDelta: {},
    compatibleTags: ['bmw'],
  },
  {
    id: 'powerflex-bushings',
    name: 'Control Arm Bushing Kit',
    brand: 'Powerflex',
    category: 'suspension',
    price: 320,
    description: 'Poly bushings to tighten chassis feel.',
    figuresDelta: {},
    compatibleTags: ['bmw'],
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
    id: 'ferodo-ds2500',
    name: 'DS2500 Pad Set',
    brand: 'Ferodo',
    category: 'brakes',
    price: 289,
    description: 'Fast-road compound pads — front axle.',
    figuresDelta: {},
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
    id: 'wavetrac-lsd',
    name: 'Wavetrac LSD',
    brand: 'Wavetrac',
    category: 'drivetrain',
    price: 1495,
    description: 'Helical LSD for planted exits (non-M open diffs).',
    figuresDelta: { zeroToSixtySec: -0.08 },
    compatibleTags: ['135i', 'm140i', 'm235i'],
  },
  {
    id: 'carbotech-mounts',
    name: 'Engine / Trans Mount Kit',
    brand: 'Turner Motorsport',
    category: 'drivetrain',
    price: 420,
    description: 'Stiffer mounts for sharper throttle response feel.',
    figuresDelta: {},
    compatibleTags: ['bmw'],
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
  {
    id: 'cf-spoiler',
    name: 'Carbon Boot Spoiler',
    brand: 'Various',
    category: 'aero',
    price: 480,
    description: 'OEM-style carbon spoiler.',
    figuresDelta: {},
    compatibleTags: ['bmw'],
  },
  {
    id: 'bride-zure',
    name: 'ZETA IV Seat (pair)',
    brand: 'Bride',
    category: 'interior',
    price: 2400,
    description: 'Fixed-back seats — saves weight.',
    figuresDelta: { weightKg: -18 },
    compatibleTags: ['*'],
  },
]

/**
 * One-click stage stacks. Applying a preset selects its mods
 * (respecting conflict groups) for a matching platform.
 */
export const stagePresets: StagePreset[] = [
  {
    id: 'n54-stage1',
    name: 'N54 Stage 1',
    description: 'Intake + Stage 1 flash — mild pump-gas street setup.',
    compatibleTags: ['n54'],
    modIds: ['afe-momentum-n54', 'mhd-stage1-n54'],
  },
  {
    id: 'n54-stage2',
    name: 'N54 Stage 2',
    description: 'Downpipes + intake + Stage 2/E85 map + HPFP.',
    compatibleTags: ['n54'],
    modIds: [
      'vrsf-dp-n54',
      'afe-momentum-n54',
      'vrsf-chargepipe-n54',
      'mhd-stage2-n54',
      'autotech-hpfp-n54',
    ],
  },
  {
    id: 'n55-stage1',
    name: 'N55 Stage 1',
    description: 'Intake + Stage 1 flash.',
    compatibleTags: ['n55'],
    modIds: ['mst-intake-n55', 'bootmod3-stage1-n55'],
  },
  {
    id: 'n55-stage2',
    name: 'N55 Stage 2',
    description: 'Downpipe + intake + chargepipe + Stage 2 + cooler.',
    compatibleTags: ['n55'],
    modIds: [
      'vrsf-dp-n55',
      'mst-intake-n55',
      'vrsf-chargepipe-n55',
      'bootmod3-stage2-n55',
      'mishimoto-ic-n55',
    ],
  },
  {
    id: 's55-stage1',
    name: 'S55 Stage 1',
    description: 'Eventuri intake + Stage 1 map.',
    compatibleTags: ['s55', 'm2c'],
    modIds: ['eventuri-s55', 'bootmod3-stage1-s55'],
  },
  {
    id: 's55-stage2',
    name: 'S55 Stage 2',
    description: 'Intake + chargepipes + Stage 2 + CSF cooler.',
    compatibleTags: ['s55', 'm2c'],
    modIds: [
      'eventuri-s55',
      'vrsf-chargepipe-s55',
      'bootmod3-stage2-s55',
      'csf-ic-s55',
    ],
  },
  {
    id: 'b58-stage1',
    name: 'B58 Stage 1',
    description: 'Intake + Stage 1 flash — classic M140i wake-up.',
    compatibleTags: ['b58', 'm140i'],
    modIds: ['mst-intake-b58', 'bootmod3-stage1-b58'],
  },
  {
    id: 'b58-stage2',
    name: 'B58 Stage 2',
    description: 'DP + intake + chargepipe + Stage 2 + FMIC.',
    compatibleTags: ['b58', 'm140i'],
    modIds: [
      'vrsf-dp-b58',
      'mst-intake-b58',
      'vrsf-chargepipe-b58',
      'bootmod3-stage2-b58',
      'vrsf-fmic-b58',
    ],
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

export function getPresetsForCar(modTags: string[]): StagePreset[] {
  return stagePresets.filter((preset) =>
    preset.compatibleTags.some(
      (tag) => tag === '*' || modTags.includes(tag),
    ),
  )
}

/** Merge a mod into a selection, clearing conflict group / conflictsWith peers. */
export function applyModSelection(
  currentIds: string[],
  modId: string,
  selected: boolean,
): string[] {
  if (!selected) {
    return currentIds.filter((id) => id !== modId)
  }

  const mod = getModById(modId)
  if (!mod) return currentIds

  const conflicts = new Set(mod.conflictsWith ?? [])
  return [
    ...currentIds.filter((id) => {
      if (id === modId) return false
      const other = getModById(id)
      if (!other) return true
      if (conflicts.has(id)) return false
      if (other.conflictsWith?.includes(modId)) return false
      if (
        mod.conflictGroup &&
        other.conflictGroup &&
        mod.conflictGroup === other.conflictGroup
      ) {
        return false
      }
      return true
    }),
    modId,
  ]
}

export function applyPreset(
  currentIds: string[],
  preset: StagePreset,
): string[] {
  let next = [...currentIds]
  for (const modId of preset.modIds) {
    next = applyModSelection(next, modId, true)
  }
  return next
}
