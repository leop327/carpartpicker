import { useEffect, useState, type FormEvent } from 'react'
import {
  clearPendingAccountAction,
  consumePendingAccountAction,
  getBioMax,
  getProfile,
  getUsernameMax,
  PROFILE_OPEN_EVENT,
  readAvatarFile,
  saveProfile,
  type UserProfile,
} from '../../lib/profile'
import './ProfilePanel.css'

interface OpenDetail {
  reason?: string
  onReady?: boolean
}

export function ProfileButton() {
  const [profile, setProfile] = useState<UserProfile | null>(() => getProfile())
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<string | null>(null)
  const [runOnReady, setRunOnReady] = useState(false)

  useEffect(() => {
    function refresh() {
      setProfile(getProfile())
    }
    function onOpen(e: Event) {
      const detail = (e as CustomEvent<OpenDetail>).detail ?? {}
      setReason(detail.reason ?? null)
      setRunOnReady(Boolean(detail.onReady))
      setOpen(true)
    }
    window.addEventListener('cpp:profile-changed', refresh)
    window.addEventListener(PROFILE_OPEN_EVENT, onOpen)
    return () => {
      window.removeEventListener('cpp:profile-changed', refresh)
      window.removeEventListener(PROFILE_OPEN_EVENT, onOpen)
    }
  }, [])

  function close() {
    setOpen(false)
    setReason(null)
    setRunOnReady(false)
    clearPendingAccountAction()
  }

  function handleSaved(next: UserProfile) {
    setProfile(next)
    setOpen(false)
    setReason(null)
    if (runOnReady) {
      setRunOnReady(false)
      consumePendingAccountAction()
    }
  }

  const initial = profile?.username?.slice(0, 1).toUpperCase() ?? '?'

  return (
    <>
      <button
        type="button"
        className="shell__profile"
        onClick={() => {
          setReason(null)
          setRunOnReady(false)
          setOpen(true)
        }}
        aria-label={profile ? `Profile: ${profile.username}` : 'Create profile'}
        title={profile ? profile.username : 'Profile'}
      >
        {profile?.avatarDataUrl ? (
          <img src={profile.avatarDataUrl} alt="" />
        ) : (
          <span aria-hidden>{initial}</span>
        )}
      </button>
      {open ? (
        <ProfilePanel
          profile={profile}
          reason={reason}
          onClose={close}
          onSaved={handleSaved}
        />
      ) : null}
    </>
  )
}

function ProfilePanel({
  profile,
  reason,
  onClose,
  onSaved,
}: {
  profile: UserProfile | null
  reason: string | null
  onClose: () => void
  onSaved: (profile: UserProfile) => void
}) {
  const [username, setUsername] = useState(profile?.username ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [avatarDataUrl, setAvatarDataUrl] = useState(
    profile?.avatarDataUrl ?? '',
  )
  const [error, setError] = useState<string | null>(null)
  const bioMax = getBioMax()
  const nameMax = getUsernameMax()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const saved = saveProfile({ username, bio, avatarDataUrl })
    if (!saved) {
      setError('Username is required to create an account')
      return
    }
    onSaved(saved)
  }

  async function onAvatarChange(file: File | null) {
    if (!file) return
    try {
      const dataUrl = await readAvatarFile(file)
      setAvatarDataUrl(dataUrl)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not upload image')
    }
  }

  return (
    <div
      className="profile-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <button
        type="button"
        className="profile-modal__backdrop"
        aria-label="Close"
        onClick={onClose}
      />
      <form className="profile-modal__card" onSubmit={handleSubmit}>
        <h2 id="profile-modal-title">
          {profile ? 'Your profile' : 'Create account'}
        </h2>
        {reason ? <p className="profile-modal__reason">{reason}</p> : null}
        <p>
          Anyone can configure a build. Save and export need a free local
          account — just a username.
        </p>

        <div className="profile-modal__avatar-row">
          <div className="profile-modal__avatar-preview">
            {avatarDataUrl ? (
              <img src={avatarDataUrl} alt="" />
            ) : (
              <span>{username.trim().slice(0, 1).toUpperCase() || '?'}</span>
            )}
          </div>
          <div className="profile-modal__avatar-actions">
            <label className="btn btn--ghost btn--small">
              Upload photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => onAvatarChange(e.target.files?.[0] ?? null)}
              />
            </label>
            {avatarDataUrl ? (
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={() => setAvatarDataUrl('')}
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>

        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value.slice(0, nameMax))}
            placeholder="e.g. sam_leeds"
            maxLength={nameMax}
            autoFocus
            autoComplete="username"
          />
        </label>

        <label>
          Bio
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, bioMax))}
            rows={3}
            maxLength={bioMax}
            placeholder="Short intro (100 characters max)"
          />
          <span className="profile-modal__count">
            {bio.length}/{bioMax}
          </span>
        </label>

        {error ? (
          <p className="profile-modal__error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="profile-modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            {profile ? 'Save profile' : 'Create account'}
          </button>
        </div>
      </form>
    </div>
  )
}
