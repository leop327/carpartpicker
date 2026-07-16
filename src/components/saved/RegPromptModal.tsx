import { useState, type FormEvent } from 'react'
import './RegPromptModal.css'

interface Props {
  initialReg?: string
  onConfirm: (registration: string) => void
  onCancel: () => void
}

export function RegPromptModal({ initialReg = '', onConfirm, onCancel }: Props) {
  const [reg, setReg] = useState(initialReg)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = reg.trim()
    if (!trimmed) {
      onCancel()
      return
    }
    onConfirm(trimmed)
  }

  return (
    <div className="reg-modal" role="dialog" aria-modal="true" aria-labelledby="reg-modal-title">
      <button type="button" className="reg-modal__backdrop" aria-label="Cancel" onClick={onCancel} />
      <form className="reg-modal__card" onSubmit={handleSubmit}>
        <h2 id="reg-modal-title">Mark as owned</h2>
        <p>
          Enter your vehicle registration to unlock maintenance logging and
          owned-car details. Leave it blank to stay as a build.
        </p>
        <label>
          Registration
          <input
            value={reg}
            onChange={(e) => setReg(e.target.value.toUpperCase())}
            placeholder="e.g. AB12 CDE"
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <div className="reg-modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            Confirm owned
          </button>
        </div>
      </form>
    </div>
  )
}
