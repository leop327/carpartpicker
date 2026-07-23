import { useState, type FormEvent } from 'react'
import {
  reportGithubUrl,
  reportMailtoUrl,
  type ReportTarget,
} from '../../lib/report'
import './ReportIncorrect.css'

interface Props {
  target: ReportTarget
  onClose: () => void
}

export function ReportIncorrect({ target, onClose }: Props) {
  const [details, setDetails] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    window.open(reportMailtoUrl(target, details), '_self')
    onClose()
  }

  return (
    <div className="report-modal" role="dialog" aria-modal aria-labelledby="report-title">
      <button
        type="button"
        className="report-modal__backdrop"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="report-modal__panel">
        <header className="report-modal__head">
          <h2 id="report-title">Report incorrect info</h2>
          <p>
            {target.kind === 'mod' && `Mod: ${target.label}`}
            {target.kind === 'car' && `Car: ${target.label}`}
            {target.kind === 'other' && target.label}
          </p>
          <button type="button" className="report-modal__close" onClick={onClose}>
            Close
          </button>
        </header>
        <form className="report-modal__form" onSubmit={handleSubmit}>
          <label>
            <span>What&apos;s wrong?</span>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              placeholder="Price, fitment, link, figures…"
              required
            />
          </label>
          <div className="report-modal__actions">
            <button type="submit" className="btn btn--primary">
              Email report
            </button>
            <a
              className="btn btn--ghost"
              href={reportGithubUrl(target, details)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open GitHub issue
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
