import { catalog } from '../data/catalog'

export interface BuildTip {
  id: string
  tone: 'info' | 'warn' | 'good'
  message: string
  /** Optional mod to one-click add from the tip. */
  suggestedModId?: string
  suggestedLabel?: string
}

function firstCompatible(
  modIds: string[],
  carTags: string[],
  candidates: string[],
): string | undefined {
  const have = new Set(modIds)
  for (const id of candidates) {
    if (have.has(id)) continue
    const mod = catalog.getModById(id)
    if (!mod) continue
    if (
      mod.compatibleTags.includes('*') ||
      mod.compatibleTags.some((t) => carTags.includes(t))
    ) {
      return id
    }
  }
  return undefined
}

/** Contextual recommended-mod tips for the current stack. */
export function resolveBuildTips(
  modIds: string[],
  carTags: string[] = [],
): BuildTip[] {
  const tips: BuildTip[] = []
  const mods = modIds
    .map((id) => catalog.getModById(id))
    .filter(Boolean)
  const cats = new Set(mods.map((m) => m!.category))
  const ids = new Set(modIds)

  const hasAggressiveTune = mods.some(
    (m) =>
      m!.category === 'ecu' &&
      (m!.id.includes('stage2') ||
        m!.id.includes('flex') ||
        (m!.figuresDelta.hp ?? 0) >= 80),
  )
  const hasStage1 = mods.some(
    (m) => m!.category === 'ecu' && m!.id.includes('stage1'),
  )
  const hasFueling = cats.has('fueling')
  const hasDp = mods.some(
    (m) =>
      m!.category === 'exhaust' && m!.name.toLowerCase().includes('downpipe'),
  )
  const hasCooling = mods.some(
    (m) =>
      m!.category === 'forced-induction' &&
      (m!.name.toLowerCase().includes('cooler') ||
        m!.name.toLowerCase().includes('fmic') ||
        m!.name.toLowerCase().includes('intercooler') ||
        m!.name.toLowerCase().includes('heat')),
  )
  const hasTurboUpgrade = mods.some(
    (m) => m!.conflictGroup === 'turbo-upgrade',
  )
  const hasBrakes = cats.has('brakes')
  const hasSuspension = cats.has('suspension')

  if (hasAggressiveTune && !hasFueling) {
    const suggested = firstCompatible(modIds, carTags, [
      'doc-race-hpfp-b58',
      'doc-race-hpfp-s55',
      'doc-race-hpfp-n55',
      'autotech-hpfp-n54',
      'fuel-it-lpfp-b58',
      'burger-meth-s55',
      'index12-injectors-n54',
    ])
    const mod = suggested ? catalog.getModById(suggested) : undefined
    tips.push({
      id: 'fueling',
      tone: 'warn',
      message: 'Fueling recommended for this tune — keep the map safe.',
      suggestedModId: suggested,
      suggestedLabel: mod ? `${mod.brand} ${mod.name}` : undefined,
    })
  }
  if (hasAggressiveTune && !hasDp) {
    const suggested = firstCompatible(modIds, carTags, [
      'vrsf-catted-dp-s55',
      'vrsf-catless-dp-s55',
      'vrsf-dp-b58',
      'vrsf-dp-n55',
      'vrsf-dp-n54',
    ])
    const mod = suggested ? catalog.getModById(suggested) : undefined
    tips.push({
      id: 'dp',
      tone: 'warn',
      message: 'Stage 2 maps usually assume a high-flow downpipe.',
      suggestedModId: suggested,
      suggestedLabel: mod ? `${mod.brand} ${mod.name}` : undefined,
    })
  }
  if ((hasAggressiveTune || hasTurboUpgrade) && !hasCooling) {
    const suggested = firstCompatible(modIds, carTags, [
      'vrsf-fmic-b58',
      'arm-fmic-b58',
      'csf-ic-s55',
      'csf-hx-s55',
      'mishimoto-ic-n55',
      'wagner-comp-n55',
      'vrsf-fmic-n54',
      'ca-chargecooler-b58',
    ])
    const mod = suggested ? catalog.getModById(suggested) : undefined
    tips.push({
      id: 'cooling',
      tone: 'info',
      message: 'Add cooling before chasing more boost.',
      suggestedModId: suggested,
      suggestedLabel: mod ? `${mod.brand} ${mod.name}` : undefined,
    })
  }
  if (hasAggressiveTune && !hasBrakes) {
    const suggested = firstCompatible(modIds, carTags, [
      'ferodo-ds2500',
      'brembo-gt-bbk',
      'stoptech-slotted',
      'goodridge-lines',
    ])
    const mod = suggested ? catalog.getModById(suggested) : undefined
    tips.push({
      id: 'brakes',
      tone: 'info',
      message: 'Power is up — pads or a BBK keep the stops honest.',
      suggestedModId: suggested,
      suggestedLabel: mod ? `${mod.brand} ${mod.name}` : undefined,
    })
  }
  if (hasStage1 && !hasSuspension && modIds.length >= 2) {
    const suggested = firstCompatible(modIds, carTags, [
      'kw-v3',
      'bc-br-coilovers',
      'eibach-prokit',
      'whiteline-sway',
    ])
    const mod = suggested ? catalog.getModById(suggested) : undefined
    tips.push({
      id: 'suspension',
      tone: 'info',
      message: 'Sharpen the chassis to match the power.',
      suggestedModId: suggested,
      suggestedLabel: mod ? `${mod.brand} ${mod.name}` : undefined,
    })
  }
  if (hasFueling && hasAggressiveTune) {
    tips.push({
      id: 'fueling-ok',
      tone: 'good',
      message: 'Fueling is covered — good call for this map.',
    })
  }
  if (ids.size === 0) {
    tips.push({
      id: 'start',
      tone: 'info',
      message: 'Try a Stage 1 preset for an instant before/after.',
    })
  }

  return tips.slice(0, 3)
}
