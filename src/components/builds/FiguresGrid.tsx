import { useEffect, useRef, useState } from 'react'
import type { Figures } from '../../types/catalog'
import { formatTorque } from '../../lib/build'
import { useAnimatedNumber } from '../../lib/useAnimatedNumber'
import './FiguresGrid.css'

interface Props {
  title: string
  figures: Figures
  compareTo?: Figures
  accelLabel?: string
  sourceNote?: string
  /** Pulse + SFX when power jumps hard. */
  animate?: boolean
}

function delta(current: number, base?: number, invert = false) {
  if (base === undefined || current === base) return null
  const diff = current - base
  const better = invert ? diff < 0 : diff > 0
  const sign = diff > 0 ? '+' : ''
  return { text: `${sign}${Number(diff.toFixed(2))}`, better }
}

function StatBar({
  value,
  max,
  invert,
}: {
  value: number
  max: number
  invert?: boolean
}) {
  const pct = Math.max(
    4,
    Math.min(100, invert ? ((max - value) / max) * 100 : (value / max) * 100),
  )
  return (
    <span className="figures__bar" aria-hidden>
      <span className="figures__bar-fill" style={{ width: `${pct}%` }} />
    </span>
  )
}

export function FiguresGrid({
  title,
  figures,
  compareTo,
  accelLabel = '0–62 mph',
  sourceNote,
  animate = true,
}: Props) {
  const hp = useAnimatedNumber(figures.hp, { durationMs: 480 })
  const tq = useAnimatedNumber(figures.torqueNm, { durationMs: 480 })
  const accel = useAnimatedNumber(figures.zeroToSixtySec, {
    durationMs: 480,
    decimals: 2,
  })
  const weight = useAnimatedNumber(figures.weightKg, { durationMs: 480 })
  const [pulse, setPulse] = useState(false)
  const prevHp = useRef(figures.hp)

  useEffect(() => {
    if (!animate) {
      prevHp.current = figures.hp
      return
    }
    const jump = figures.hp - prevHp.current
    prevHp.current = figures.hp
    if (jump >= 25) {
      setPulse(true)
      const t = window.setTimeout(() => setPulse(false), 700)
      return () => window.clearTimeout(t)
    }
  }, [figures.hp, animate])

  const displayHp = animate ? hp : figures.hp
  const displayTq = animate ? tq : figures.torqueNm
  const displayAccel = animate ? accel : figures.zeroToSixtySec
  const displayWeight = animate ? weight : figures.weightKg

  const rows: {
    label: string
    value: string
    tip?: ReturnType<typeof delta>
    bar?: { value: number; max: number; invert?: boolean }
  }[] = [
    {
      label: 'Power',
      value: `${displayHp} hp`,
      tip: delta(figures.hp, compareTo?.hp),
      bar: { value: figures.hp, max: Math.max(figures.hp, compareTo?.hp ?? 0, 500) },
    },
    {
      label: 'Torque',
      value: formatTorque(displayTq),
      tip: delta(figures.torqueNm, compareTo?.torqueNm),
      bar: {
        value: figures.torqueNm,
        max: Math.max(figures.torqueNm, compareTo?.torqueNm ?? 0, 700),
      },
    },
    {
      label: accelLabel,
      value: `${displayAccel.toFixed(2)} s`,
      tip: delta(figures.zeroToSixtySec, compareTo?.zeroToSixtySec, true),
      bar: {
        value: figures.zeroToSixtySec,
        max: Math.max(figures.zeroToSixtySec, compareTo?.zeroToSixtySec ?? 0, 7),
        invert: true,
      },
    },
    {
      label: 'Weight',
      value: `${displayWeight} kg`,
      tip: delta(figures.weightKg, compareTo?.weightKg, true),
      bar: {
        value: figures.weightKg,
        max: Math.max(figures.weightKg, compareTo?.weightKg ?? 0, 1800),
        invert: true,
      },
    },
    { label: 'Drivetrain', value: figures.drivetrain },
    {
      label: 'Engine',
      value: `${figures.engineSizeL.toFixed(1)} L · ${figures.engineCode}`,
    },
  ]

  return (
    <div className={pulse ? 'figures figures--pulse' : 'figures'}>
      <div className="figures__head">
        <h3 className="figures__title">{title}</h3>
        {sourceNote && <span className="figures__source">{sourceNote}</span>}
      </div>
      <dl className="figures__grid">
        {rows.map((row) => (
          <div key={row.label} className="figures__row">
            <dt>{row.label}</dt>
            <dd>
              <span className="figures__value">{row.value}</span>
              {row.tip && (
                <span
                  className={
                    row.tip.better
                      ? 'figures__delta figures__delta--up'
                      : 'figures__delta figures__delta--down'
                  }
                >
                  {row.tip.text}
                </span>
              )}
            </dd>
            {row.bar && (
              <StatBar
                value={row.bar.value}
                max={row.bar.max}
                invert={row.bar.invert}
              />
            )}
          </div>
        ))}
      </dl>
    </div>
  )
}
