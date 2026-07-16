import { useEffect, useRef, useState } from 'react'
import './DragRace.css'

export interface DragRacer {
  id: string
  label: string
  sublabel?: string
  image?: string
  zeroToSixtySec: number
  accent?: string
}

interface Props {
  left: DragRacer
  right: DragRacer
  title?: string
  /** Compact layout for embedding in mods tab. */
  compact?: boolean
}

type RacePhase = 'idle' | 'racing' | 'done'

/** Wall-clock ms per second of 0–62 — keeps races watchable. */
const MS_PER_SEC = 850

export function DragRace({ left, right, title, compact }: Props) {
  const [phase, setPhase] = useState<RacePhase>('idle')
  const [progress, setProgress] = useState({ left: 0, right: 0 })
  const [winnerId, setWinnerId] = useState<string | null>(null)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef(0)
  const leftRef = useRef(left)
  const rightRef = useRef(right)
  leftRef.current = left
  rightRef.current = right

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    setPhase('idle')
    setProgress({ left: 0, right: 0 })
    setWinnerId(null)
  }, [left.id, right.id, left.zeroToSixtySec, right.zeroToSixtySec])

  function tick(now: number) {
    const L = leftRef.current
    const R = rightRef.current
    const elapsed = now - startRef.current
    const leftMs = Math.max(L.zeroToSixtySec, 1.5) * MS_PER_SEC
    const rightMs = Math.max(R.zeroToSixtySec, 1.5) * MS_PER_SEC
    const pL = Math.min(1, elapsed / leftMs)
    const pR = Math.min(1, elapsed / rightMs)
    setProgress({ left: pL, right: pR })

    if (pL >= 1 && pR >= 1) {
      const tie = Math.abs(L.zeroToSixtySec - R.zeroToSixtySec) < 0.005
      setWinnerId(
        tie ? 'tie' : L.zeroToSixtySec < R.zeroToSixtySec ? L.id : R.id,
      )
      setPhase('done')
      return
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  function startRace() {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    setProgress({ left: 0, right: 0 })
    setWinnerId(null)
    setPhase('racing')
    startRef.current = performance.now()
    rafRef.current = requestAnimationFrame(tick)
  }

  const resultLabel =
    winnerId === 'tie'
      ? 'Dead heat'
      : winnerId === left.id
        ? `${left.label} wins`
        : winnerId === right.id
          ? `${right.label} wins`
          : null

  return (
    <div className={compact ? 'drag-race drag-race--compact' : 'drag-race'}>
      <div className="drag-race__head">
        <div>
          {title ? <h3 className="drag-race__title">{title}</h3> : null}
          <p className="drag-race__hint">
            Quicker 0–62 reaches the line first.
          </p>
        </div>
        <div className="drag-race__actions">
          {phase !== 'racing' ? (
            <button
              type="button"
              className="btn btn--primary btn--small"
              onClick={startRace}
            >
              {phase === 'done' ? 'Race again' : 'Start race'}
            </button>
          ) : null}
        </div>
      </div>

      <div className="drag-race__track" aria-live="polite">
        {phase === 'done' && resultLabel ? (
          <div className="drag-race__banner">{resultLabel}</div>
        ) : null}

        <Lane
          racer={left}
          progress={progress.left}
          won={winnerId === left.id}
        />
        <Lane
          racer={right}
          progress={progress.right}
          won={winnerId === right.id}
        />
      </div>

      <div className="drag-race__times">
        <span>
          {left.label}: <strong>{left.zeroToSixtySec.toFixed(2)}s</strong>
        </span>
        <span>
          {right.label}: <strong>{right.zeroToSixtySec.toFixed(2)}s</strong>
        </span>
      </div>
    </div>
  )
}

function Lane({
  racer,
  progress,
  won,
}: {
  racer: DragRacer
  progress: number
  won: boolean
}) {
  return (
    <div className={`drag-lane${won ? ' drag-lane--won' : ''}`}>
      <div className="drag-lane__meta">
        <strong>{racer.label}</strong>
        {racer.sublabel ? <span>{racer.sublabel}</span> : null}
      </div>
      <div className="drag-lane__road">
        <div className="drag-lane__finish" aria-hidden />
        <div
          className="drag-lane__mover"
          style={{ width: `${Math.max(progress * 100, 0.01)}%` }}
        >
          <div
            className="drag-lane__car"
            style={{ borderColor: racer.accent ?? 'var(--line)' }}
          >
            {racer.image ? (
              <img src={racer.image} alt="" />
            ) : (
              <span
                className="drag-lane__fallback"
                style={{ background: racer.accent }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
