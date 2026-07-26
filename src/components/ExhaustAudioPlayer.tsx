import { useEffect, useRef, useState } from 'react'
import './ExhaustAudioPlayer.css'

export type ExhaustClip = 'revs' | 'flyby'

interface Props {
  revsUrl?: string
  flybyUrl?: string
  label?: string
}

/**
 * Dual-clip exhaust sound check — Revs + Flyby.
 * Only one clip plays at a time; switching stops the active clip.
 */
export function ExhaustAudioPlayer({ revsUrl, flybyUrl, label }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState<ExhaustClip | null>(null)

  const hasRevs = Boolean(revsUrl)
  const hasFlyby = Boolean(flybyUrl)
  const hasAny = hasRevs || hasFlyby

  useEffect(() => {
    return () => {
      const audio = audioRef.current
      if (audio) {
        audio.pause()
        audio.src = ''
      }
      audioRef.current = null
    }
  }, [])

  async function play(clip: ExhaustClip, url: string | undefined) {
    if (!url) return

    const existing = audioRef.current
    if (existing) {
      existing.pause()
      existing.currentTime = 0
    }

    if (playing === clip && existing && !existing.paused) {
      existing.pause()
      setPlaying(null)
      return
    }

    const audio = existing ?? new Audio()
    audioRef.current = audio
    audio.src = url
    audio.onended = () => setPlaying(null)
    audio.onerror = () => setPlaying(null)
    setPlaying(clip)
    try {
      await audio.play()
    } catch {
      setPlaying(null)
    }
  }

  if (!hasAny) {
    return (
      <div className="exhaust-audio exhaust-audio--empty" aria-label="No audio sample">
        <span className="exhaust-audio__muted">No Audio Sample</span>
      </div>
    )
  }

  return (
    <div
      className="exhaust-audio"
      role="group"
      aria-label={label ? `${label} sound check` : 'Exhaust sound check'}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {hasRevs ? (
        <button
          type="button"
          className={
            playing === 'revs'
              ? 'exhaust-audio__btn exhaust-audio__btn--active'
              : 'exhaust-audio__btn'
          }
          aria-pressed={playing === 'revs'}
          onClick={() => void play('revs', revsUrl)}
        >
          <span className="exhaust-audio__icon" aria-hidden>
            {playing === 'revs' ? (
              <span className="exhaust-audio__wave" />
            ) : (
              '🔊'
            )}
          </span>
          Revs
        </button>
      ) : null}
      {hasFlyby ? (
        <button
          type="button"
          className={
            playing === 'flyby'
              ? 'exhaust-audio__btn exhaust-audio__btn--active'
              : 'exhaust-audio__btn'
          }
          aria-pressed={playing === 'flyby'}
          onClick={() => void play('flyby', flybyUrl)}
        >
          <span className="exhaust-audio__icon" aria-hidden>
            {playing === 'flyby' ? (
              <span className="exhaust-audio__wave" />
            ) : (
              '🏎️'
            )}
          </span>
          Flyby
        </button>
      ) : null}
    </div>
  )
}
