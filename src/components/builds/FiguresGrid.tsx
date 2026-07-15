import type { Figures } from '../../types/catalog'
import { formatTorque } from '../../lib/build'
import './FiguresGrid.css'

interface Props {
  title: string
  figures: Figures
  compareTo?: Figures
}

function delta(current: number, base?: number, invert = false) {
  if (base === undefined || current === base) return null
  const diff = current - base
  const better = invert ? diff < 0 : diff > 0
  const sign = diff > 0 ? '+' : ''
  return { text: `${sign}${Number(diff.toFixed(2))}`, better }
}

export function FiguresGrid({ title, figures, compareTo }: Props) {
  const rows: {
    label: string
    value: string
    tip?: ReturnType<typeof delta>
  }[] = [
    {
      label: 'Power',
      value: `${figures.hp} hp`,
      tip: delta(figures.hp, compareTo?.hp),
    },
    {
      label: 'Torque',
      value: formatTorque(figures.torqueNm),
      tip: delta(figures.torqueNm, compareTo?.torqueNm),
    },
    {
      label: '0–60 mph',
      value: `${figures.zeroToSixtySec.toFixed(2)} s`,
      tip: delta(figures.zeroToSixtySec, compareTo?.zeroToSixtySec, true),
    },
    {
      label: 'Weight',
      value: `${figures.weightKg} kg`,
      tip: delta(figures.weightKg, compareTo?.weightKg, true),
    },
    { label: 'Drivetrain', value: figures.drivetrain },
    {
      label: 'Engine',
      value: `${figures.engineSizeL.toFixed(1)} L · ${figures.engineCode}`,
    },
  ]

  return (
    <div className="figures">
      <h3 className="figures__title">{title}</h3>
      <dl className="figures__grid">
        {rows.map((row) => (
          <div key={row.label} className="figures__row">
            <dt>{row.label}</dt>
            <dd>
              {row.value}
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
          </div>
        ))}
      </dl>
    </div>
  )
}
