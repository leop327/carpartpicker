import type { Mod, ModCategory } from '../../types/catalog'

export const modCategories: ModCategory[] = [
  {
    id: 'exhaust',
    name: 'Exhaust',
    description: 'Cat-backs, headers, and valence deletes.',
  },
  {
    id: 'intake',
    name: 'Intake',
    description: 'Cold-air intakes and intake upgrades.',
  },
  {
    id: 'forced-induction',
    name: 'Forced induction',
    description: 'Turbo / supercharger hardware upgrades.',
  },
  {
    id: 'ecu',
    name: 'ECU / tune',
    description: 'Flash tunes and piggybacks.',
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
    description: 'Spoilers, splitters, wings.',
  },
  {
    id: 'drivetrain',
    name: 'Drivetrain',
    description: 'Clutches, LSD, axles.',
  },
  {
    id: 'interior',
    name: 'Interior',
    description: 'Seats, harnesses, weight reduction.',
  },
]

/**
 * Real-world-style parts with ballpark street prices (USD).
 * Tag empty compatibleTags or use '*' for universal fitment.
 * Add new mods as separate files later if the list grows — keep this registry.
 */
export const mods: Mod[] = [
  // —— Exhaust ——
  {
    id: 'akrapovic-evolution-s58',
    name: 'Evolution Line Titanium',
    brand: 'Akrapovič',
    category: 'exhaust',
    price: 6499,
    description: 'Full titanium Evolution Line for S58 M cars.',
    figuresDelta: { hp: 12, torqueNm: 15, weightKg: -7, zeroToSixtySec: -0.05 },
    compatibleTags: ['s58', 'm3', 'g80'],
  },
  {
    id: 'borla-ataq-mustang',
    name: 'ATAK Cat-Back',
    brand: 'Borla',
    category: 'exhaust',
    price: 1899,
    description: 'Aggressive ATAK cat-back for S650 Mustang GT.',
    figuresDelta: { hp: 8, torqueNm: 10, weightKg: -4 },
    compatibleTags: ['mustang', 's650', 'coyote'],
  },
  {
    id: 'remark-catback-fl5',
    name: 'Double Wall Cat-Back',
    brand: 'Remark',
    category: 'exhaust',
    price: 1499,
    description: 'Stainless double-wall cat-back for FL5 Type R.',
    figuresDelta: { hp: 6, torqueNm: 8, weightKg: -3 },
    compatibleTags: ['fl5', 'type-r', 'civic'],
  },
  {
    id: 'invidia-n1-mx5',
    name: 'N1 Cat-Back',
    brand: 'Invidia',
    category: 'exhaust',
    price: 799,
    description: 'N1 single-exit cat-back for ND MX-5.',
    figuresDelta: { hp: 4, torqueNm: 5, weightKg: -2 },
    compatibleTags: ['mx5', 'miata', 'nd'],
  },
  {
    id: 'nameless-axleback-wrx',
    name: 'Axle-Back 5" Muffler Delete',
    brand: 'Nameless Performance',
    category: 'exhaust',
    price: 449,
    description: 'Axle-back delete style system for VB WRX.',
    figuresDelta: { hp: 3, torqueNm: 4, weightKg: -5 },
    compatibleTags: ['wrx', 'vb', 'subaru'],
  },
  {
    id: 'magnaflow-street',
    name: 'Street Series Cat-Back',
    brand: 'MagnaFlow',
    category: 'exhaust',
    price: 1199,
    description: 'Universal-fitment style street cat-back (check listing).',
    figuresDelta: { hp: 5, torqueNm: 6, weightKg: -3 },
    compatibleTags: ['*'],
  },

  // —— Intake ——
  {
    id: 'mst-intake-fl5',
    name: 'Competition Intake',
    brand: 'MST Performance',
    category: 'intake',
    price: 429,
    description: 'Closed-box competition intake for FL5.',
    figuresDelta: { hp: 8, torqueNm: 10 },
    compatibleTags: ['fl5', 'type-r', 'k20'],
  },
  {
    id: 'eventuri-s58',
    name: 'Carbon Intake System',
    brand: 'Eventuri',
    category: 'intake',
    price: 1895,
    description: 'Carbon venturi intake for S58 M cars.',
    figuresDelta: { hp: 15, torqueNm: 18 },
    compatibleTags: ['s58', 'm3', 'g80'],
  },
  {
    id: 'aem-v2-universal',
    name: 'V2 Cold Air Intake',
    brand: 'AEM',
    category: 'intake',
    price: 379,
    description: 'Dry-flow cold air intake — common platform kit.',
    figuresDelta: { hp: 6, torqueNm: 7 },
    compatibleTags: ['*'],
  },
  {
    id: 'cobb-sf-wrx',
    name: 'SF Intake & Airbox',
    brand: 'COBB Tuning',
    category: 'intake',
    price: 445,
    description: 'SF intake + airbox for FA24 WRX.',
    figuresDelta: { hp: 10, torqueNm: 14 },
    compatibleTags: ['wrx', 'vb', 'fa24'],
  },

  // —— Forced induction ——
  {
    id: 'pure-stage2-s58',
    name: 'Stage 2 Turbo Upgrade',
    brand: 'Pure Turbos',
    category: 'forced-induction',
    price: 5499,
    description: 'Larger hybrid turbos for S58 — needs supporting mods/tune.',
    figuresDelta: { hp: 120, torqueNm: 140, zeroToSixtySec: -0.35 },
    compatibleTags: ['s58', 'turbo'],
    conflictsWith: ['stock-turbo-tune-only'],
  },
  {
    id: 'garrett-g30-kit',
    name: 'G30-770 Turbo Kit',
    brand: 'Garrett',
    category: 'forced-induction',
    price: 4200,
    description: 'Single turbo upgrade path for FA24 platforms.',
    figuresDelta: { hp: 90, torqueNm: 110, zeroToSixtySec: -0.3 },
    compatibleTags: ['fa24', 'wrx', 'turbo'],
  },
  {
    id: 'roush-supercharger-s650',
    name: 'Phase 2 Supercharger Kit',
    brand: 'Roush',
    category: 'forced-induction',
    price: 7999,
    description: 'TVS supercharger kit for Coyote Mustangs.',
    figuresDelta: { hp: 250, torqueNm: 200, zeroToSixtySec: -0.6 },
    compatibleTags: ['mustang', 'coyote', 's650'],
  },

  // —— ECU ——
  {
    id: 'bootmod3-stage1',
    name: 'Stage 1 93 OTS Map',
    brand: 'bootmod3',
    category: 'ecu',
    price: 599,
    description: 'OTS Stage 1 flash for S58 on 93 octane.',
    figuresDelta: { hp: 60, torqueNm: 80, zeroToSixtySec: -0.2 },
    compatibleTags: ['s58', 'bmw'],
  },
  {
    id: 'hondata-fk8-style',
    name: 'FlashPro + Stage 1',
    brand: 'Hondata',
    category: 'ecu',
    price: 895,
    description: 'FlashPro hardware + Stage 1 calibration for K20C1.',
    figuresDelta: { hp: 25, torqueNm: 40, zeroToSixtySec: -0.15 },
    compatibleTags: ['k20', 'type-r', 'civic'],
  },
  {
    id: 'cobb-accessport-wrx',
    name: 'Accessport + Stage 1',
    brand: 'COBB Tuning',
    category: 'ecu',
    price: 695,
    description: 'Accessport V3 with Stage 1 93 map for VB WRX.',
    figuresDelta: { hp: 35, torqueNm: 50, zeroToSixtySec: -0.15 },
    compatibleTags: ['wrx', 'vb', 'subaru'],
  },
  {
    id: 'lund-racing-tune',
    name: 'Custom Dyno Tune',
    brand: 'Lund Racing',
    category: 'ecu',
    price: 799,
    description: 'Custom street/dyno calibration for Coyote platforms.',
    figuresDelta: { hp: 20, torqueNm: 25, zeroToSixtySec: -0.08 },
    compatibleTags: ['coyote', 'mustang'],
  },
  {
    id: 'versatuner-mx5',
    name: 'VersaTuner Stage 1',
    brand: 'VersaTuner',
    category: 'ecu',
    price: 449,
    description: 'Handheld flash with Stage 1 for ND MX-5.',
    figuresDelta: { hp: 10, torqueNm: 12, zeroToSixtySec: -0.08 },
    compatibleTags: ['mx5', 'nd', 'mazda'],
  },

  // —— Suspension ——
  {
    id: 'kw-v3',
    name: 'V3 Coilover Kit',
    brand: 'KW Suspension',
    category: 'suspension',
    price: 2899,
    description: 'Independently adjustable compression & rebound coilovers.',
    figuresDelta: { weightKg: -2, zeroToSixtySec: -0.02 },
    compatibleTags: ['*'],
  },
  {
    id: 'owens-super-sport',
    name: 'Super Sport Coilovers',
    brand: 'Ohlins',
    category: 'suspension',
    price: 4200,
    description: 'DFV coilovers — track-capable street setup.',
    figuresDelta: { weightKg: -3, zeroToSixtySec: -0.03 },
    compatibleTags: ['*'],
  },
  {
    id: 'whiteline-sway',
    name: 'Front & Rear Sway Bar Kit',
    brand: 'Whiteline',
    category: 'suspension',
    price: 549,
    description: 'Adjustable sway bars for sharper transient response.',
    figuresDelta: {},
    compatibleTags: ['*'],
  },

  // —— Brakes ——
  {
    id: 'brembo-gt-bbk',
    name: 'GT Big Brake Kit',
    brand: 'Brembo',
    category: 'brakes',
    price: 4599,
    description: '6-piston front BBK with 380mm rotors.',
    figuresDelta: { weightKg: 8 },
    compatibleTags: ['*'],
  },
  {
    id: 'ferodo-ds2500',
    name: 'DS2500 Pad Set',
    brand: 'Ferodo',
    category: 'brakes',
    price: 289,
    description: 'Fast-road compound pads — front axle set.',
    figuresDelta: {},
    compatibleTags: ['*'],
  },

  // —— Wheels ——
  {
    id: 'rays-te37',
    name: 'TE37 Saga S-Plus (set)',
    brand: 'Rays Engineering',
    category: 'wheels',
    price: 3200,
    description: 'Forged TE37 set — lighter than stock alloys.',
    figuresDelta: { weightKg: -12, zeroToSixtySec: -0.05 },
    compatibleTags: ['*'],
  },
  {
    id: 'apex-vs-5rs',
    name: 'VS-5RS (set)',
    brand: 'Apex Wheels',
    category: 'wheels',
    price: 1896,
    description: 'Flow-formed track wheels — popular on BMWs & more.',
    figuresDelta: { weightKg: -8, zeroToSixtySec: -0.03 },
    compatibleTags: ['*'],
  },
  {
    id: 'michelin-ps4s',
    name: 'Pilot Sport 4S (set)',
    brand: 'Michelin',
    category: 'wheels',
    price: 1200,
    description: 'Ultra-high performance summer tyre set.',
    figuresDelta: { zeroToSixtySec: -0.1 },
    compatibleTags: ['*'],
  },

  // —— Aero ——
  {
    id: 'carbon-front-lip',
    name: 'Carbon Front Lip',
    brand: 'Various',
    category: 'aero',
    price: 650,
    description: 'Dry carbon front lip spoiler.',
    figuresDelta: { weightKg: -1 },
    compatibleTags: ['*'],
  },
  {
    id: 'apr-gt250-wing',
    name: 'GT-250 Adjustable Wing',
    brand: 'APR Performance',
    category: 'aero',
    price: 1899,
    description: '67" carbon GT wing — serious downforce.',
    figuresDelta: { weightKg: 7, zeroToSixtySec: 0.05 },
    compatibleTags: ['*'],
  },

  // —— Drivetrain ——
  {
    id: 'os-giken-lsd',
    name: 'Super Lock LSD',
    brand: 'OS Giken',
    category: 'drivetrain',
    price: 2295,
    description: 'Multi-plate LSD for planted exit traction.',
    figuresDelta: { zeroToSixtySec: -0.08 },
    compatibleTags: ['rwd', 'fwd'],
  },
  {
    id: 'act-clutch',
    name: 'Heavy-Duty Clutch Kit',
    brand: 'ACT',
    category: 'drivetrain',
    price: 875,
    description: 'Street/track organic-sprung clutch kit.',
    figuresDelta: { weightKg: -2 },
    compatibleTags: ['*'],
  },

  // —— Interior ——
  {
    id: 'bride-zure',
    name: 'ZETA IV Seat (pair)',
    brand: 'Bride',
    category: 'interior',
    price: 2400,
    description: 'FIA-friendly fixed-back seats — saves weight.',
    figuresDelta: { weightKg: -18 },
    compatibleTags: ['*'],
  },
  {
    id: 'omp-harness',
    name: '6-Point Harness (pair)',
    brand: 'OMP',
    category: 'interior',
    price: 520,
    description: 'Street-legal-where-applicable 6-point harnesses.',
    figuresDelta: { weightKg: 2 },
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
