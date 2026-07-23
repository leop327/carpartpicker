/**
 * Local auth layer — email + password (Web Crypto), ready to swap for Clerk/Supabase.
 * Session persists in localStorage; builds can be public or private on the profile.
 */

import type { SavedBuild } from './savedBuilds'
import { listSavedBuilds } from './savedBuilds'
import { getProfile, saveProfile } from './profile'

export interface AuthUser {
  id: string
  email: string
  displayName: string
  /** Public profile slug */
  username: string
  createdAt: string
}

interface StoredAccount {
  id: string
  email: string
  displayName: string
  username: string
  passwordHash: string
  salt: string
  createdAt: string
}

const ACCOUNTS_KEY = 'carpartpicker:accounts:v1'
const SESSION_KEY = 'carpartpicker:session:v1'

async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function readAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredAccount[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAccounts(accounts: StoredAccount[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

function toUser(a: StoredAccount): AuthUser {
  return {
    id: a.id,
    email: a.email,
    displayName: a.displayName,
    username: a.username,
    createdAt: a.createdAt,
  }
}

export function getSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthUser
    if (!parsed?.id || !parsed?.email) return null
    return parsed
  } catch {
    return null
  }
}

function setSession(user: AuthUser | null): void {
  if (!user) {
    localStorage.removeItem(SESSION_KEY)
  } else {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  }
  window.dispatchEvent(new CustomEvent('cpp:auth-changed', { detail: user }))
}

export function isSignedIn(): boolean {
  return Boolean(getSession())
}

export async function signUp(input: {
  email: string
  password: string
  displayName: string
  username: string
}): Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }> {
  const email = input.email.trim().toLowerCase()
  const username = input.username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')
  const displayName = input.displayName.trim().slice(0, 40)
  if (!email.includes('@')) return { ok: false, error: 'Enter a valid email' }
  if (input.password.length < 6)
    return { ok: false, error: 'Password must be at least 6 characters' }
  if (!username || username.length < 2)
    return { ok: false, error: 'Username must be at least 2 characters' }
  if (!displayName) return { ok: false, error: 'Display name required' }

  const accounts = readAccounts()
  if (accounts.some((a) => a.email === email))
    return { ok: false, error: 'Email already registered' }
  if (accounts.some((a) => a.username === username))
    return { ok: false, error: 'Username taken' }

  const salt = crypto.randomUUID()
  const passwordHash = await hashPassword(input.password, salt)
  const account: StoredAccount = {
    id: crypto.randomUUID(),
    email,
    displayName,
    username,
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
  }
  writeAccounts([...accounts, account])
  saveProfile({ username: displayName, bio: '' })
  const user = toUser(account)
  setSession(user)
  return { ok: true, user }
}

export async function signIn(input: {
  email: string
  password: string
}): Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }> {
  const email = input.email.trim().toLowerCase()
  const account = readAccounts().find((a) => a.email === email)
  if (!account) return { ok: false, error: 'No account for that email' }
  const hash = await hashPassword(input.password, account.salt)
  if (hash !== account.passwordHash)
    return { ok: false, error: 'Incorrect password' }
  const user = toUser(account)
  setSession(user)
  const profile = getProfile()
  if (!profile) saveProfile({ username: user.displayName })
  return { ok: true, user }
}

export function signOut(): void {
  setSession(null)
}

export function getAccountByUsername(username: string): AuthUser | null {
  const slug = username.trim().toLowerCase()
  const account = readAccounts().find((a) => a.username === slug)
  return account ? toUser(account) : null
}

/** Public builds for a username (visibility === 'public'). */
export function listPublicBuildsForUser(username: string): SavedBuild[] {
  const account = getAccountByUsername(username)
  if (!account) return []
  return listSavedBuilds().filter(
    (b) =>
      b.visibility === 'public' &&
      (b.ownerUserId === account.id ||
        b.ownerUsername?.toLowerCase() === account.username),
  )
}

export function listMyPublicBuilds(): SavedBuild[] {
  const session = getSession()
  if (!session) return []
  return listSavedBuilds().filter(
    (b) => b.visibility === 'public' && b.ownerUserId === session.id,
  )
}
