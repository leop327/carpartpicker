import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getSession,
  signIn,
  signOut,
  signUp,
  type AuthUser,
} from '../lib/auth'
import './StaticPage.css'
import './AccountPage.css'

export function AccountPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(() => getSession())
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    function onAuth() {
      setUser(getSession())
    }
    window.addEventListener('cpp:auth-changed', onAuth)
    return () => window.removeEventListener('cpp:auth-changed', onAuth)
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const result =
      mode === 'signin'
        ? await signIn({ email, password })
        : await signUp({ email, password, displayName, username })
    setBusy(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setUser(result.user)
  }

  if (user) {
    return (
      <div className="static account">
        <h1>Account</h1>
        <p className="static__lead">
          Signed in as <strong>{user.displayName}</strong> ({user.email}).
        </p>
        <p>
          Public profile:{' '}
          <Link to={`/u/${user.username}`}>/u/{user.username}</Link>
        </p>
        <p className="account__note">
          Local auth for now — swap to Clerk or Supabase when you add a backend.
          Builds stay on this device until cloud sync.
        </p>
        <div className="account__actions">
          <Link to="/saved" className="btn btn--primary">
            My builds
          </Link>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              signOut()
              setUser(null)
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="static account">
      <h1>{mode === 'signin' ? 'Sign in' : 'Create account'}</h1>
      <p className="static__lead">
        Save public builds and claim a profile. Passwords stay hashed in this
        browser until we move to real auth.
      </p>
      <form className="account__form" onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <>
            <label>
              Display name
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                autoComplete="nickname"
              />
            </label>
            <label>
              Username
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                pattern="[a-zA-Z0-9_-]{2,32}"
                autoComplete="username"
              />
            </label>
          </>
        )}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />
        </label>
        {error && <p className="account__error">{error}</p>}
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>
      <p>
        {mode === 'signin' ? (
          <>
            No account?{' '}
            <button
              type="button"
              className="account__link"
              onClick={() => {
                setMode('signup')
                setError(null)
              }}
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already registered?{' '}
            <button
              type="button"
              className="account__link"
              onClick={() => {
                setMode('signin')
                setError(null)
              }}
            >
              Sign in
            </button>
          </>
        )}
      </p>
      <button
        type="button"
        className="btn btn--ghost"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
    </div>
  )
}
