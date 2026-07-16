export interface UserProfile {
  username: string
  bio: string
  /** Data URL for uploaded avatar, or empty. */
  avatarDataUrl: string
  updatedAt: string
}

const PROFILE_KEY = 'carpartpicker:profile:v1'
export const PROFILE_OPEN_EVENT = 'cpp:open-profile'

const BIO_MAX = 100
const USERNAME_MAX = 32

export function getBioMax(): number {
  return BIO_MAX
}

export function getUsernameMax(): number {
  return USERNAME_MAX
}

export function getProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<UserProfile>
    const username = typeof parsed.username === 'string' ? parsed.username.trim() : ''
    if (!username) return null
    return {
      username: username.slice(0, USERNAME_MAX),
      bio: typeof parsed.bio === 'string' ? parsed.bio.slice(0, BIO_MAX) : '',
      avatarDataUrl:
        typeof parsed.avatarDataUrl === 'string' ? parsed.avatarDataUrl : '',
      updatedAt:
        typeof parsed.updatedAt === 'string'
          ? parsed.updatedAt
          : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

/** Account exists once a username is set. */
export function hasAccount(): boolean {
  return Boolean(getProfile()?.username)
}

export function saveProfile(input: {
  username: string
  bio?: string
  avatarDataUrl?: string
}): UserProfile | null {
  const username = input.username.trim().slice(0, USERNAME_MAX)
  if (!username) return null
  const prev = getProfile()
  const next: UserProfile = {
    username,
    bio: (input.bio ?? prev?.bio ?? '').trim().slice(0, BIO_MAX),
    avatarDataUrl:
      input.avatarDataUrl !== undefined
        ? input.avatarDataUrl
        : (prev?.avatarDataUrl ?? ''),
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent('cpp:profile-changed'))
  return next
}

export function clearProfile(): void {
  localStorage.removeItem(PROFILE_KEY)
  window.dispatchEvent(new CustomEvent('cpp:profile-changed'))
}

export function openProfilePanel(detail?: {
  reason?: string
  /** Run after a valid account exists / is saved. */
  onReady?: boolean
}): void {
  window.dispatchEvent(
    new CustomEvent(PROFILE_OPEN_EVENT, {
      detail: detail ?? {},
    }),
  )
}

/** If account exists, run action. Otherwise open profile to create one. */
let pendingAccountAction: (() => void) | null = null

export function requireAccount(action: () => void, reason?: string): void {
  if (hasAccount()) {
    action()
    return
  }
  pendingAccountAction = action
  openProfilePanel({ reason, onReady: true })
}

export function consumePendingAccountAction(): void {
  const action = pendingAccountAction
  pendingAccountAction = null
  action?.()
}

export function clearPendingAccountAction(): void {
  pendingAccountAction = null
}

const MAX_AVATAR_BYTES = 900_000

export function readAvatarFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Choose an image file'))
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      reject(new Error('Image must be under ~900KB'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') {
        reject(new Error('Could not read image'))
        return
      }
      resolve(result)
    }
    reader.onerror = () => reject(new Error('Could not read image'))
    reader.readAsDataURL(file)
  })
}
