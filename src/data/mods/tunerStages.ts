import type { StagePreset } from '../../types/catalog'

/** Maps + supporting bolt-ons only — no aero / styling / chassis cosmetics. */
export const STAGE_KIT_CATEGORIES = new Set([
  'ecu',
  'intake',
  'exhaust',
  'forced-induction',
  'fueling',
])

export type TunerBrand = 'MHD' | 'bootmod3'

export type StageLevel =
  | '0'
  | '1'
  | '1+'
  | '2'
  | '2+'
  | 'e30'
  | 'e50'
  | 'e85'
  | 'super'

export interface TunerStageKit {
  id: string
  tuner: TunerBrand
  stage: StageLevel
  label: string
  compatibleTags: string[]
  /** Map + bolt-on mod ids (validated at apply time). */
  modIds: string[]
}

export const STAGE_ORDER: StageLevel[] = [
  '0',
  '1',
  '1+',
  '2',
  '2+',
  'e30',
  'e50',
  'e85',
  'super',
]

const STAGE_LABELS: Record<StageLevel, string> = {
  '0': 'Stage 0',
  '1': 'Stage 1',
  '1+': 'Stage 1+',
  '2': 'Stage 2',
  '2+': 'Stage 2+',
  e30: 'E30 blend',
  e50: 'E50 blend',
  e85: 'E85',
  super: 'Super',
}

/**
 * Curated map + bolt-on stacks per tuner.
 * Styling / aero intentionally omitted.
 */
export const tunerStageKits: TunerStageKit[] = [
  // —— N54 ——
  {
    id: 'n54-mhd-1',
    tuner: 'MHD',
    stage: '1',
    label: STAGE_LABELS['1'],
    compatibleTags: ['n54'],
    modIds: ['afe-momentum-n54', 'mhd-stage1-n54'],
  },
  {
    id: 'n54-mhd-2',
    tuner: 'MHD',
    stage: '2',
    label: STAGE_LABELS['2'],
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
    id: 'n54-mhd-e30',
    tuner: 'MHD',
    stage: 'e30',
    label: STAGE_LABELS.e30,
    compatibleTags: ['n54'],
    modIds: [
      'vrsf-dp-n54',
      'afe-momentum-n54',
      'mhd-e30-n54',
      'autotech-hpfp-n54',
    ],
  },
  {
    id: 'n54-mhd-e85',
    tuner: 'MHD',
    stage: 'e85',
    label: STAGE_LABELS.e85,
    compatibleTags: ['n54'],
    modIds: [
      'afe-momentum-n54',
      'vrsf-dp-n54',
      'mhd-e85-n54',
      'autotech-hpfp-n54',
      'fuel-it-flex-n54',
    ],
  },

  // —— N55 ——
  {
    id: 'n55-mhd-1',
    tuner: 'MHD',
    stage: '1',
    label: STAGE_LABELS['1'],
    compatibleTags: ['n55'],
    modIds: ['mst-intake-n55', 'mhd-stage1-n55'],
  },
  {
    id: 'n55-mhd-2',
    tuner: 'MHD',
    stage: '2',
    label: STAGE_LABELS['2'],
    compatibleTags: ['n55'],
    modIds: [
      'mhd-stage2-n55',
      'vrsf-dp-n55',
      'mst-intake-n55',
      'wagner-comp-n55',
    ],
  },
  {
    id: 'n55-mhd-2plus',
    tuner: 'MHD',
    stage: '2+',
    label: STAGE_LABELS['2+'],
    compatibleTags: ['n55'],
    modIds: [
      'mhd-stage2plus-n55',
      'vrsf-dp-n55',
      'mst-intake-n55',
      'wagner-comp-n55',
    ],
  },
  {
    id: 'n55-mhd-super',
    tuner: 'MHD',
    stage: 'super',
    label: STAGE_LABELS.super,
    compatibleTags: ['n55', 'm2'],
    modIds: ['mhd-super-n55'],
  },
  {
    id: 'n55-bm3-1',
    tuner: 'bootmod3',
    stage: '1',
    label: STAGE_LABELS['1'],
    compatibleTags: ['n55'],
    modIds: ['mst-intake-n55', 'bootmod3-stage1-n55'],
  },
  {
    id: 'n55-bm3-2',
    tuner: 'bootmod3',
    stage: '2',
    label: STAGE_LABELS['2'],
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
    id: 'n55-bm3-2plus',
    tuner: 'bootmod3',
    stage: '2+',
    label: STAGE_LABELS['2+'],
    compatibleTags: ['n55'],
    modIds: [
      'vrsf-dp-n55',
      'mst-intake-n55',
      'bootmod3-stage2plus-n55',
      'mishimoto-ic-n55',
    ],
  },

  // —— S55 ——
  {
    id: 's55-mhd-1',
    tuner: 'MHD',
    stage: '1',
    label: STAGE_LABELS['1'],
    compatibleTags: ['s55', 'm2c', 'm3', 'm4'],
    modIds: ['eventuri-s55', 'mhd-stage1-s55'],
  },
  {
    id: 's55-mhd-2',
    tuner: 'MHD',
    stage: '2',
    label: STAGE_LABELS['2'],
    compatibleTags: ['s55', 'm2c', 'm3', 'm4'],
    modIds: [
      'mhd-stage2-s55',
      'vrsf-catted-dp-s55',
      'eventuri-s55',
      'csf-ic-s55',
    ],
  },
  {
    id: 's55-mhd-super',
    tuner: 'MHD',
    stage: 'super',
    label: STAGE_LABELS.super,
    compatibleTags: ['s55', 'm2c', 'm3', 'm4'],
    modIds: ['mhd-super-s55'],
  },
  {
    id: 's55-bm3-1',
    tuner: 'bootmod3',
    stage: '1',
    label: STAGE_LABELS['1'],
    compatibleTags: ['s55', 'm2c', 'm3', 'm4'],
    modIds: ['eventuri-s55', 'bootmod3-stage1-s55'],
  },
  {
    id: 's55-bm3-2',
    tuner: 'bootmod3',
    stage: '2',
    label: STAGE_LABELS['2'],
    compatibleTags: ['s55', 'm2c', 'm3', 'm4'],
    modIds: [
      'vrsf-catted-dp-s55',
      'eventuri-s55',
      'vrsf-chargepipe-s55',
      'bootmod3-stage2-s55',
      'csf-ic-s55',
    ],
  },
  {
    id: 's55-bm3-2plus',
    tuner: 'bootmod3',
    stage: '2+',
    label: STAGE_LABELS['2+'],
    compatibleTags: ['s55', 'm2c', 'm3', 'm4'],
    modIds: [
      'vrsf-catted-dp-s55',
      'eventuri-s55',
      'bootmod3-stage2plus-s55',
      'csf-ic-s55',
    ],
  },

  // —— B58 ——
  {
    id: 'b58-mhd-1',
    tuner: 'MHD',
    stage: '1',
    label: STAGE_LABELS['1'],
    compatibleTags: ['b58', 'm140i'],
    modIds: ['mst-intake-b58', 'mhd-stage1-b58'],
  },
  {
    id: 'b58-mhd-2',
    tuner: 'MHD',
    stage: '2',
    label: STAGE_LABELS['2'],
    compatibleTags: ['b58', 'm140i'],
    modIds: [
      'mhd-stage2-b58',
      'vrsf-dp-b58',
      'mst-intake-b58',
      'csf-fmic-b58',
    ],
  },
  {
    id: 'b58-mhd-2plus',
    tuner: 'MHD',
    stage: '2+',
    label: STAGE_LABELS['2+'],
    compatibleTags: ['b58', 'm140i'],
    modIds: [
      'mhd-stage2plus-b58',
      'vrsf-dp-b58',
      'mst-intake-b58',
      'csf-fmic-b58',
    ],
  },
  {
    id: 'b58-bm3-1',
    tuner: 'bootmod3',
    stage: '1',
    label: STAGE_LABELS['1'],
    compatibleTags: ['b58', 'm140i'],
    modIds: ['mst-intake-b58', 'bootmod3-stage1-b58'],
  },
  {
    id: 'b58-bm3-2',
    tuner: 'bootmod3',
    stage: '2',
    label: STAGE_LABELS['2'],
    compatibleTags: ['b58', 'm140i'],
    modIds: [
      'vrsf-dp-b58',
      'mst-intake-b58',
      'vrsf-chargepipe-b58',
      'bootmod3-stage2-b58',
      'vrsf-fmic-b58',
    ],
  },
  {
    id: 'b58-bm3-2plus',
    tuner: 'bootmod3',
    stage: '2+',
    label: STAGE_LABELS['2+'],
    compatibleTags: ['b58', 'm140i'],
    modIds: [
      'vrsf-dp-b58',
      'mst-intake-b58',
      'bootmod3-stage2plus-b58',
      'vrsf-fmic-b58',
    ],
  },

  // —— S58 ——
  {
    id: 's58-mhd-1',
    tuner: 'MHD',
    stage: '1',
    label: STAGE_LABELS['1'],
    compatibleTags: ['s58'],
    modIds: ['mhd-stage1-s58', 'mst-intake-s58'],
  },
  {
    id: 's58-mhd-super',
    tuner: 'MHD',
    stage: 'super',
    label: STAGE_LABELS.super,
    compatibleTags: ['s58', 'g87'],
    modIds: ['mhd-super-s58'],
  },
  {
    id: 's58-bm3-1',
    tuner: 'bootmod3',
    stage: '1',
    label: STAGE_LABELS['1'],
    compatibleTags: ['s58'],
    modIds: ['bootmod3-stage1-s58', 'mst-intake-s58'],
  },
  {
    id: 's58-bm3-2',
    tuner: 'bootmod3',
    stage: '2',
    label: STAGE_LABELS['2'],
    compatibleTags: ['s58'],
    modIds: [
      'bootmod3-stage2-s58',
      'vrsf-dp-s58',
      'mst-intake-s58',
      'csf-chargecooler-s58',
      'doc-race-hpfp-s58',
    ],
  },
]

export type { StagePreset }
