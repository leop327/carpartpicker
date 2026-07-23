import type { Mod, StagePreset } from '../../types/catalog'

/** Brands allowed on M2 builds (F87 / Comp / G87). */
export const M2_ALLOWED_BRANDS = new Set([
  'MHD',
  'AutoID',
  'Clubsport Garage',
  'Maxton Design',
])

/**
 * Curated F87 / G87 M2 products — MHD, AutoID, Clubsport Garage & Maxton only.
 * Live UK GBP prices + buy links.
 */
export const m2Mods: Mod[] = [
  // —— MHD ——
  {
    id: 'mhd-super-n55',
    name: 'Super License (N55)',
    brand: 'MHD',
    category: 'ecu',
    price: 444,
    description:
      'MHD Super License for N55 — flasher, monitor, and all OTS map packs. F87 M2 typically runs Stage 2+ maps (Stage 1 OTS is not for the high-output M2 N55). Adapter sold separately.',
    claim: 'All maps in one license',
    figuresDelta: { hp: 70, torqueNm: 90, zeroToSixtySec: -0.28 },
    figuresSource: 'tuner',
    compatibleTags: ['n55', 'f87'],
    conflictGroup: 'ecu-tune',
  },
  {
    id: 'mhd-super-s55',
    name: 'Super License (S55)',
    brand: 'MHD',
    category: 'ecu',
    price: 444,
    description:
      'MHD Super License for S55 — flasher, monitor, and all OTS map packs for M2 Competition / F8x. Adapter sold separately.',
    claim: 'All maps in one license',
    figuresDelta: { hp: 65, torqueNm: 85, zeroToSixtySec: -0.22 },
    figuresSource: 'tuner',
    compatibleTags: ['s55'],
    conflictGroup: 'ecu-tune',
  },
  {
    id: 'mhd-super-s58',
    name: 'Super License (S58)',
    brand: 'MHD',
    category: 'ecu',
    price: 444,
    description:
      'MHD Super License for S58 — flasher, monitor, and all OTS map packs for G87 M2 / G8x. Newer DMEs may need a bench unlock first. Adapter sold separately.',
    claim: 'All maps in one license',
    figuresDelta: { hp: 65, torqueNm: 85, zeroToSixtySec: -0.18 },
    figuresSource: 'tuner',
    compatibleTags: ['s58'],
    conflictGroup: 'ecu-tune',
  },

  // —— AutoID (via Clubsport Garage) ——
  {
    id: 'autoid-csl-splitter-f87',
    name: 'FORM E-CSL Front Splitter',
    brand: 'AutoID',
    category: 'aero',
    price: 449,
    description:
      'AutoID FORM carbon E-CSL front splitter for F87 M2 (2015–2018). Not compatible with M2 Competition or CS.',
    claim: 'CSL-inspired carbon lip',
    figuresDelta: {},
    compatibleTags: ['f87', 'n55'],
    incompatibleTags: ['m2c', 's55'],
    conflictGroup: 'front-splitter',
  },
  {
    id: 'autoid-gts-splitter-f87c',
    name: 'GTS Performance Front Splitter',
    brand: 'AutoID',
    category: 'aero',
    price: 449,
    description:
      'AutoID pre-preg carbon GTS-style front splitter for F87 M2 Competition (2018–2021).',
    claim: 'GTS-style front bite',
    figuresDelta: {},
    compatibleTags: ['f87', 's55'],
    conflictGroup: 'front-splitter',
  },
  {
    id: 'autoid-tre-splitter-f87',
    name: 'TRE Performance Front Splitter',
    brand: 'AutoID',
    category: 'aero',
    price: 749,
    description:
      'AutoID TRE pre-preg carbon performance front splitter for F87 M2.',
    claim: 'Track-leaning carbon splitter',
    figuresDelta: {},
    compatibleTags: ['f87'],
    conflictGroup: 'front-splitter',
  },
  {
    id: 'autoid-diffuser-f87',
    name: 'FORM M Performance Rear Diffuser',
    brand: 'AutoID',
    category: 'aero',
    price: 349,
    description:
      'AutoID FORM carbon M Performance-style rear diffuser for F87 M2 and M2 Competition.',
    claim: 'Carbon rear fill',
    figuresDelta: {},
    compatibleTags: ['f87'],
    conflictGroup: 'rear-diffuser',
  },
  {
    id: 'autoid-skirts-f87',
    name: 'Carbon Side Skirts',
    brand: 'AutoID',
    category: 'aero',
    price: 449,
    description:
      'AutoID 2×2 weave carbon side skirts for F87 M2 and M2 Competition (2015–2021).',
    claim: 'Full-length carbon skirts',
    figuresDelta: {},
    compatibleTags: ['f87'],
    conflictGroup: 'side-skirts',
  },
  {
    id: 'tre-comp-diffuser-f87',
    name: 'TRE Competition Rear Diffuser',
    brand: 'AutoID',
    category: 'aero',
    price: 765,
    description:
      'TRE pre-preg carbon Competition rear diffuser for F87 M2 / Competition.',
    claim: 'Aggressive carbon diffuser',
    figuresDelta: {},
    compatibleTags: ['f87'],
    conflictGroup: 'rear-diffuser',
  },
  {
    id: 'tre-mperf-diffuser-f87',
    name: 'TRE M Performance Diffuser',
    brand: 'AutoID',
    category: 'aero',
    price: 599,
    description:
      'TRE pre-preg carbon M Performance-style rear diffuser for F87 M2 / Competition.',
    figuresDelta: {},
    compatibleTags: ['f87'],
    conflictGroup: 'rear-diffuser',
  },

  // —— Clubsport Garage ——
  {
    id: 'tre-mirrors-f8x',
    name: 'Pre-preg Carbon Mirror Covers',
    brand: 'Clubsport Garage',
    category: 'styling',
    price: 319,
    description:
      'TRE pre-preg carbon wing mirror covers for F87 M2 Competition / F80 M3 / F82 M4. Sold via Clubsport Garage UK.',
    claim: 'Pre-preg mirror caps',
    figuresDelta: {},
    compatibleTags: ['f87', 'f80', 'f82'],
  },

  // —— Maxton Design ——
  {
    id: 'maxton-splitter-v3-f87',
    name: 'Front Splitter V.3',
    brand: 'Maxton Design',
    category: 'aero',
    price: 174,
    description:
      'Maxton Design Street Plus front splitter V.3 for BMW M2 F87 (2016–2020). Gloss black ABS, fitting kit included.',
    claim: 'OEM+ front lip',
    figuresDelta: {},
    compatibleTags: ['f87'],
    conflictGroup: 'front-splitter',
  },
  {
    id: 'maxton-side-flaps-f87',
    name: 'Side Flaps',
    brand: 'Maxton Design',
    category: 'aero',
    price: 59,
    description: 'Maxton Design side flaps for BMW M2 F87.',
    figuresDelta: {},
    compatibleTags: ['f87'],
  },
  {
    id: 'maxton-rear-side-flaps-f87',
    name: 'Rear Side Flaps',
    brand: 'Maxton Design',
    category: 'aero',
    price: 59,
    description: 'Maxton Design rear side flaps for BMW M2 F87.',
    figuresDelta: {},
    compatibleTags: ['f87'],
  },
  {
    id: 'maxton-splitter-v1-g87',
    name: 'Front Splitter V.1',
    brand: 'Maxton Design',
    category: 'aero',
    price: 174,
    description:
      'Maxton Design front splitter V.1 for BMW M2 G87. Gloss black ABS with fitting kit.',
    claim: 'OEM+ front lip',
    figuresDelta: {},
    compatibleTags: ['g87'],
    conflictGroup: 'front-splitter',
  },
  {
    id: 'maxton-splitter-v2-g87',
    name: 'Front Splitter V.2',
    brand: 'Maxton Design',
    category: 'aero',
    price: 174,
    description:
      'Maxton Design front splitter V.2 for BMW M2 G87. Gloss black ABS with fitting kit.',
    figuresDelta: {},
    compatibleTags: ['g87'],
    conflictGroup: 'front-splitter',
  },
  {
    id: 'maxton-splitter-v3-g87',
    name: 'Front Splitter V.3',
    brand: 'Maxton Design',
    category: 'aero',
    price: 174,
    description:
      'Maxton Design front splitter V.3 for BMW M2 G87. Gloss black ABS with fitting kit.',
    figuresDelta: {},
    compatibleTags: ['g87'],
    conflictGroup: 'front-splitter',
  },
  {
    id: 'maxton-side-flaps-g87',
    name: 'Side Flaps',
    brand: 'Maxton Design',
    category: 'aero',
    price: 59,
    description: 'Maxton Design side flaps for BMW M2 G87.',
    figuresDelta: {},
    compatibleTags: ['g87'],
  },
]

export const m2Presets: StagePreset[] = [
  {
    id: 'f87-m2-mhd-maxton',
    name: 'F87 M2 MHD + Maxton',
    description: 'MHD Super License + Maxton V.3 splitter.',
    compatibleTags: ['m2'],
    modIds: ['mhd-super-n55', 'maxton-splitter-v3-f87'],
  },
  {
    id: 'f87-m2-autoid-aero',
    name: 'F87 M2 AutoID Aero',
    description: 'E-CSL splitter + skirts + FORM diffuser.',
    compatibleTags: ['m2'],
    modIds: [
      'autoid-csl-splitter-f87',
      'autoid-skirts-f87',
      'autoid-diffuser-f87',
    ],
  },
  {
    id: 'f87-m2c-autoid',
    name: 'M2 Comp AutoID Aero',
    description: 'GTS splitter + skirts + TRE Competition diffuser.',
    compatibleTags: ['m2c'],
    modIds: [
      'autoid-gts-splitter-f87c',
      'autoid-skirts-f87',
      'tre-comp-diffuser-f87',
    ],
  },
  {
    id: 'f87-m2c-mhd-maxton',
    name: 'M2 Comp MHD + Maxton',
    description: 'MHD Super License + Maxton V.3 splitter.',
    compatibleTags: ['m2c'],
    modIds: ['mhd-super-s55', 'maxton-splitter-v3-f87'],
  },
  {
    id: 'g87-m2-mhd-maxton',
    name: 'G87 M2 MHD + Maxton',
    description: 'MHD Super License + Maxton V.1 splitter.',
    compatibleTags: ['g87'],
    modIds: ['mhd-super-s58', 'maxton-splitter-v1-g87'],
  },
]
