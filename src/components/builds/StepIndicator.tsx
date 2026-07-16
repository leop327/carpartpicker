import './StepIndicator.css'
import type { BuildStage } from '../../lib/buildState'

const STEPS: { id: BuildStage; label: string }[] = [
  { id: 'brand', label: 'Brand' },
  { id: 'model', label: 'Model' },
  { id: 'year', label: 'Year' },
  { id: 'colour', label: 'Colour' },
  { id: 'options', label: 'Options' },
  { id: 'mods', label: 'Mods' },
]

interface Props {
  stage: BuildStage
  onStepClick?: (stage: BuildStage) => void
  unlocked: BuildStage[]
}

export function StepIndicator({ stage, onStepClick, unlocked }: Props) {
  const activeIndex = STEPS.findIndex((s) => s.id === stage)

  return (
    <ol className="steps" aria-label="Build progress">
      {STEPS.map((step, index) => {
        const state =
          index < activeIndex ? 'done' : index === activeIndex ? 'active' : 'todo'
        const jumpable = unlocked.includes(step.id) && index <= activeIndex
        return (
          <li
            key={step.id}
            className={`steps__item steps__item--${state}`}
            aria-current={state === 'active' ? 'step' : undefined}
          >
            {jumpable && onStepClick ? (
              <button
                type="button"
                className="steps__btn"
                onClick={() => onStepClick(step.id)}
              >
                <span className="steps__index">{index + 1}</span>
                <span className="steps__label">{step.label}</span>
              </button>
            ) : (
              <span className="steps__static">
                <span className="steps__index">{index + 1}</span>
                <span className="steps__label">{step.label}</span>
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}
