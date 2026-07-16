import type { SpecOptionGroup } from '../../types/catalog'

/** 6MT standard / 7-speed M DCT optional — F87 / F80 / F82 M cars. */
export function mDctTransmission(zeroToSixtyDelta = -0.2): SpecOptionGroup {
  return {
    id: 'transmission',
    name: 'Transmission',
    description: 'UK: 6-speed manual was standard; 7-speed M DCT with Drivelogic optional.',
    required: false,
    choices: [
      { id: 'manual', name: '6-speed manual', price: 0, isDefault: true },
      {
        id: 'dct',
        name: '7-speed M DCT with Drivelogic',
        price: 0,
        description: 'Faster shifts and launch control; typically ~0.2s quicker 0–62.',
        figuresDelta: { weightKg: 25, zeroToSixtySec: zeroToSixtyDelta },
      },
    ],
  }
}

/** F80/F82: Adaptive M Suspension was standard equipment on UK cars. */
export function f8xAdaptiveStandard(): SpecOptionGroup {
  return {
    id: 'suspension',
    name: 'Suspension',
    description: 'UK F80/F82: Adaptive M Suspension (Comfort / Sport / Sport+) was standard.',
    required: false,
    choices: [
      {
        id: 'adaptive',
        name: 'Adaptive M Suspension (standard)',
        price: 0,
        isDefault: true,
        description: 'Electronically adjustable dampers — standard on UK M3/M4.',
      },
    ],
  }
}

/** F80/F82: CFRP roof was standard — not a delete option in normal UK ordering. */
export function f8xCarbonRoofStandard(): SpecOptionGroup {
  return {
    id: 'roof',
    name: 'Roof',
    description: 'UK F80/F82: CFRP carbon-fibre roof was standard.',
    required: false,
    choices: [
      {
        id: 'cfrp',
        name: 'CFRP carbon-fibre roof (standard)',
        price: 0,
        isDefault: true,
        figuresDelta: { weightKg: 0 },
        description: 'Exposed carbon roof included from the factory.',
      },
    ],
  }
}

/** F80/F82 brakes: M compound standard; M Carbon ceramic optional (2NK). */
export function f8xBrakes(): SpecOptionGroup {
  return {
    id: 'brakes',
    name: 'Brakes',
    description: 'UK: M compound brakes standard; M Carbon ceramic optional.',
    required: false,
    choices: [
      {
        id: 'compound',
        name: 'M compound brakes (standard)',
        price: 0,
        isDefault: true,
        description: 'Blue-caliper M compound discs.',
      },
      {
        id: 'carbon-ceramic',
        name: 'M Carbon ceramic brakes',
        price: 0,
        figuresDelta: { weightKg: -18 },
        description: 'Optional 2NK — gold calipers, major unsprung-weight saving.',
      },
    ],
  }
}

/** F80/F82 seats: M-specific seats standard; carbon buckets optional. */
export function f8xSeats(): SpecOptionGroup {
  return {
    id: 'seats',
    name: 'Seats',
    description: 'UK: M-specific seats standard; M Carbon bucket seats optional.',
    required: false,
    choices: [
      {
        id: 'm-specific',
        name: 'M-specific seats (standard)',
        price: 0,
        isDefault: true,
        description: 'Lightweight construction with integrated headrests.',
      },
      {
        id: 'carbon-buckets',
        name: 'M Carbon bucket seats',
        price: 0,
        figuresDelta: { weightKg: -12 },
        description: 'Optional carbon-shell buckets.',
      },
    ],
  }
}

export function f8xWheels(): SpecOptionGroup {
  return {
    id: 'wheels',
    name: 'Wheels',
    description: 'UK: 18" M wheels standard; 19" M forged / style options available.',
    required: false,
    choices: [
      {
        id: '18',
        name: '18" M light-alloy (standard)',
        price: 0,
        isDefault: true,
        description: '255/40 front, 275/40 rear.',
      },
      {
        id: '19',
        name: '19" M light-alloy',
        price: 0,
        figuresDelta: { weightKg: -2 },
        description: 'Larger optional M styles (e.g. 437M / 441M).',
      },
    ],
  }
}

export function mDriversPackage(): SpecOptionGroup {
  return {
    id: 'm-drivers',
    name: "M Driver's Package",
    description: 'Raises top-speed limiter (typically to 174 mph / 280 km/h) + track day.',
    required: false,
    choices: [
      { id: 'none', name: 'Not fitted', price: 0, isDefault: true },
      {
        id: 'fitted',
        name: "M Driver's Package",
        price: 0,
        description: 'Top-speed increase + BMW Driver Training voucher (UK).',
      },
    ],
  }
}

export function parkingAndCameras(): SpecOptionGroup {
  return {
    id: 'parking',
    name: 'Parking & cameras',
    required: false,
    choices: [
      { id: 'none', name: 'None / sensors only as fitted', price: 0, isDefault: true },
      {
        id: 'rear-camera',
        name: 'Reversing assist camera',
        price: 0,
      },
      {
        id: 'parking-assistant',
        name: 'Parking Assistant + camera',
        price: 0,
      },
    ],
  }
}

export function interiorTrim(options: {
  carbonStandard?: boolean
  merinoStandard?: boolean
}): SpecOptionGroup {
  if (options.carbonStandard) {
    return {
      id: 'interior-trim',
      name: 'Interior trim',
      description: 'Carbon-fibre interior trim was standard on M2 Competition.',
      required: false,
      choices: [
        {
          id: 'carbon',
          name: 'Carbon-fibre trim (standard)',
          price: 0,
          isDefault: true,
        },
      ],
    }
  }
  return {
    id: 'interior-trim',
    name: 'Interior trim',
    required: false,
    choices: [
      {
        id: 'standard',
        name: options.merinoStandard
          ? 'Extended Merino / standard M trim'
          : 'Standard interior trim',
        price: 0,
        isDefault: true,
      },
      {
        id: 'carbon',
        name: 'Carbon-fibre interior trim',
        price: 0,
        description: 'Optional carbon trim with black high-gloss finisher.',
      },
    ],
  }
}

/** F87 M2 / M2 Competition: fixed M Sport suspension only (Adaptive = CS only). */
export function f87FixedSuspension(label = 'M Sport suspension (standard)'): SpecOptionGroup {
  return {
    id: 'suspension',
    name: 'Suspension',
    description:
      'Adaptive dampers were not a factory option on M2 / M2 Competition (CS only).',
    required: false,
    choices: [
      {
        id: 'fixed',
        name: label,
        price: 0,
        isDefault: true,
      },
    ],
  }
}

/** F87 brakes: compound / M Sport only — no factory CCB on Comp. */
export function f87Brakes(): SpecOptionGroup {
  return {
    id: 'brakes',
    name: 'Brakes',
    description:
      'UK M2/M2 Comp: M compound / M Sport brakes only. Carbon ceramics were not factory options (CS only).',
    required: false,
    choices: [
      {
        id: 'compound',
        name: 'M compound brakes (standard)',
        price: 0,
        isDefault: true,
      },
      {
        id: 'm-sport-brakes',
        name: 'M Sport brakes upgrade',
        price: 0,
        description: 'Optional higher-spec iron discs / calipers where offered.',
      },
    ],
  }
}

export function f87Seats(competition = false): SpecOptionGroup {
  return {
    id: 'seats',
    name: 'Seats',
    description: competition
      ? 'UK M2 Competition: M Sport seats with illuminated M2 badge were standard. Carbon buckets were not offered.'
      : 'UK M2: M Sport seats standard.',
    required: false,
    choices: [
      {
        id: 'm-sport',
        name: competition
          ? 'M Sport seats with illuminated badge (standard)'
          : 'M Sport seats (standard)',
        price: 0,
        isDefault: true,
      },
      {
        id: 'electric',
        name: 'Electric front seats with driver memory',
        price: 0,
        description: 'Often via Comfort pack on Competition.',
      },
    ],
  }
}

export function f87Wheels(competition = false): SpecOptionGroup {
  return {
    id: 'wheels',
    name: 'Wheels',
    required: false,
    choices: competition
      ? [
          {
            id: '19-788',
            name: '19" M Y-spoke style 788M (standard)',
            price: 0,
            isDefault: true,
          },
          {
            id: '19-dark',
            name: '19" M Y-spoke 788M Dark finish',
            price: 0,
            description: 'Included in M2 Plus pack.',
          },
        ]
      : [
          {
            id: '19-standard',
            name: '19" M light-alloy (standard)',
            price: 0,
            isDefault: true,
          },
        ],
  }
}

/** M140i / M235i style Steptronic platforms. */
export function stepTronicTransmission(opts?: {
  autoDefault?: boolean
  manualWeightDelta?: number
  manualZeroToSixtyDelta?: number
}): SpecOptionGroup {
  const autoDefault = opts?.autoDefault ?? true
  return {
    id: 'transmission',
    name: 'Transmission',
    required: false,
    choices: [
      {
        id: 'auto',
        name: '8-speed Steptronic automatic',
        price: 0,
        isDefault: autoDefault,
        description: 'ZF 8HP — most common UK choice.',
      },
      {
        id: 'manual',
        name: '6-speed manual',
        price: 0,
        isDefault: !autoDefault,
        figuresDelta: {
          weightKg: opts?.manualWeightDelta ?? -25,
          zeroToSixtySec: opts?.manualZeroToSixtyDelta ?? 0.2,
        },
      },
    ],
  }
}

export function adaptiveMSportSuspension(): SpecOptionGroup {
  return {
    id: 'suspension',
    name: 'Suspension',
    description: 'UK M140i/M235i: Adaptive M Sport suspension was a popular optional extra.',
    required: false,
    choices: [
      {
        id: 'standard',
        name: 'M Sport suspension (passive)',
        price: 0,
        isDefault: true,
      },
      {
        id: 'adaptive',
        name: 'Adaptive M Sport suspension',
        price: 0,
        description: 'Electronically adjustable dampers.',
      },
    ],
  }
}

export function mSportBrakesOption(): SpecOptionGroup {
  return {
    id: 'brakes',
    name: 'Brakes',
    required: false,
    choices: [
      {
        id: 'standard',
        name: 'Standard brakes',
        price: 0,
        isDefault: true,
      },
      {
        id: 'm-sport',
        name: 'M Sport brakes',
        price: 0,
        description: 'Larger discs / performance calipers (e.g. blue calipers).',
      },
    ],
  }
}

export function e82Transmission(n55 = false): SpecOptionGroup {
  return {
    id: 'transmission',
    name: 'Transmission',
    required: false,
    choices: n55
      ? [
          {
            id: 'manual',
            name: '6-speed manual',
            price: 0,
            isDefault: true,
          },
          {
            id: 'dct',
            name: '7-speed dual-clutch (DKG)',
            price: 0,
            figuresDelta: { weightKg: 20, zeroToSixtySec: -0.15 },
            description: 'Optional on LCI N55 135i.',
          },
        ]
      : [
          {
            id: 'manual',
            name: '6-speed manual',
            price: 0,
            isDefault: true,
          },
          {
            id: 'auto',
            name: '6-speed Steptronic automatic',
            price: 0,
            figuresDelta: { weightKg: 30, zeroToSixtySec: 0.3 },
          },
        ],
  }
}

export function e82MSportPackage(): SpecOptionGroup {
  return {
    id: 'package',
    name: 'Package',
    required: false,
    choices: [
      { id: 'base', name: 'SE / base', price: 0, isDefault: true },
      {
        id: 'm-sport',
        name: 'M Sport',
        price: 0,
        description: 'M Aerodynamics package, M Sport suspension, M steering wheel, unique wheels.',
      },
    ],
  }
}

export function e82Suspension(): SpecOptionGroup {
  return {
    id: 'suspension',
    name: 'Suspension',
    description: 'Electronic Damper Control (EDC) was optional on E82.',
    required: false,
    choices: [
      {
        id: 'standard',
        name: 'Standard / M Sport passive',
        price: 0,
        isDefault: true,
      },
      {
        id: 'edc',
        name: 'Electronic Damper Control (EDC)',
        price: 0,
        description: 'Optional adaptive dampers.',
      },
    ],
  }
}

export function sunProtectionGlass(): SpecOptionGroup {
  return {
    id: 'glass',
    name: 'Glass',
    required: false,
    choices: [
      { id: 'clear', name: 'Standard glass', price: 0, isDefault: true },
      {
        id: 'sun-protection',
        name: 'Sun protection glass',
        price: 0,
        description: 'Darker rear / rear-side glass.',
      },
    ],
  }
}
