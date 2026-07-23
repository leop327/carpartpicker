import { useEffect, useState, type FormEvent } from 'react'
import {
  getFitmentSummary,
  getSupportingMods,
  submitFitmentVote,
  type FitmentDifficulty,
  type FitmentSummary,
} from '../../lib/fitment'
import { catalog } from '../../data/catalog'
import './FitmentVotes.css'

interface Props {
  carId: string
  modId: string
  compact?: boolean
}

export function FitmentVotes({ carId, modId, compact }: Props) {
  const [summary, setSummary] = useState<FitmentSummary>(() =>
    getFitmentSummary(carId, modId),
  )
  const [open, setOpen] = useState(false)
  const [fitted, setFitted] = useState(true)
  const [hours, setHours] = useState('')
  const [difficulty, setDifficulty] = useState<FitmentDifficulty>('moderate')
  const [review, setReview] = useState('')

  useEffect(() => {
    function refresh() {
      setSummary(getFitmentSummary(carId, modId))
    }
    refresh()
    window.addEventListener('cpp:fitment-changed', refresh)
    return () => window.removeEventListener('cpp:fitment-changed', refresh)
  }, [carId, modId])

  const supporting = getSupportingMods(carId, modId, 3)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    submitFitmentVote({
      carId,
      modId,
      fitted,
      installHours: hours ? Number(hours) : null,
      difficulty,
      review,
    })
    setOpen(false)
    setReview('')
    setHours('')
  }

  if (compact && summary.votes === 0) {
    return (
      <button
        type="button"
        className="fitment fitment--compact"
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
      >
        Did this fit?
      </button>
    )
  }

  return (
    <div
      className={compact ? 'fitment fitment--compact' : 'fitment'}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {summary.votes > 0 ? (
        <div className="fitment__stats">
          <span>
            <strong>{summary.successPct}%</strong> fitted
          </span>
          {summary.avgInstallHours != null && (
            <span>~{summary.avgInstallHours}h install</span>
          )}
          {summary.difficultyMode && (
            <span className="fitment__diff">{summary.difficultyMode}</span>
          )}
          <span>{summary.votes} vote{summary.votes === 1 ? '' : 's'}</span>
        </div>
      ) : (
        <p className="fitment__empty">No fitment votes yet.</p>
      )}

      {supporting.length > 0 && !compact && (
        <p className="fitment__also">
          Most people also add:{' '}
          {supporting
            .map((s) => {
              const mod = catalog.getModById(s.modId)
              return mod ? `${mod.name} (${s.pct}%)` : null
            })
            .filter(Boolean)
            .join(' · ')}
        </p>
      )}

      {!open ? (
        <button
          type="button"
          className="fitment__vote-btn"
          onClick={() => setOpen(true)}
        >
          Vote fitment
        </button>
      ) : (
        <form className="fitment__form" onSubmit={handleSubmit}>
          <div className="fitment__row">
            <label>
              <input
                type="radio"
                checked={fitted}
                onChange={() => setFitted(true)}
              />{' '}
              Fitted OK
            </label>
            <label>
              <input
                type="radio"
                checked={!fitted}
                onChange={() => setFitted(false)}
              />{' '}
              Issues
            </label>
          </div>
          <label>
            Install hours
            <input
              type="number"
              min={0}
              step={0.5}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="e.g. 2"
            />
          </label>
          <label>
            Difficulty
            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as FitmentDifficulty)
              }
            >
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
              <option value="pro">Pro / lift</option>
            </select>
          </label>
          <label>
            Short review
            <input
              type="text"
              maxLength={280}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Optional"
            />
          </label>
          <div className="fitment__row">
            <button type="submit" className="btn btn--primary btn--small">
              Submit
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
