import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { catalog } from '../data/catalog'
import { formatMoney, resolveSpecChoices } from '../lib/build'
import {
  findCommunityBySavedId,
  publishOwnedBuild,
  unpublishBySavedId,
} from '../lib/community'
import { getProfile, requireAccount } from '../lib/profile'
import { downloadModList, downloadMaintenanceLog } from '../lib/exportMods'
import { figuresFromSelection } from '../lib/selection'
import { MARKET, accelLabel } from '../lib/market'
import {
  addMaintenanceLog,
  deleteMaintenanceLog,
  formatRegistration,
  getSavedBuild,
  markSavedBuildAsBuild,
  markSavedBuildOwned,
  selectionLabel,
  setBuildVisibility,
  updateOwnedVehicleInfo,
  updateSavedBuildNotes,
  type MaintenanceLogEntry,
  type SavedBuild,
} from '../lib/savedBuilds'
import { getSession } from '../lib/auth'
import { RegPromptModal } from '../components/saved/RegPromptModal'
import './SavedBuildDetailPage.css'

type TabId = 'details' | 'mods' | 'maintenance' | 'notes'

export function SavedBuildDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [entry, setEntry] = useState<SavedBuild | null>(() =>
    id ? getSavedBuild(id) ?? null : null,
  )
  const [tab, setTab] = useState<TabId>('details')
  const [regOpen, setRegOpen] = useState(false)
  const [notesDraft, setNotesDraft] = useState('')
  const [flash, setFlash] = useState<string | null>(null)
  const [authorName, setAuthorName] = useState('')
  const [communityCaption, setCommunityCaption] = useState('')
  const [publishedId, setPublishedId] = useState<string | null>(null)

  useEffect(() => {
    const next = id ? getSavedBuild(id) ?? null : null
    setEntry(next)
    setNotesDraft(next?.notes ?? '')
    const published = id ? findCommunityBySavedId(id) : undefined
    setPublishedId(published?.id ?? null)
    if (published) {
      setAuthorName(published.authorName)
      setCommunityCaption(published.caption ?? '')
    } else {
      const profile = getProfile()
      setAuthorName(profile?.username ?? '')
      setCommunityCaption('')
    }
  }, [id])

  const car = entry?.build.selection.carId
    ? catalog.getCarById(entry.build.selection.carId)
    : undefined
  const colour = car?.colours.find(
    (c) => c.id === entry?.build.selection.colourId,
  )
  const figures = useMemo(
    () => (entry ? figuresFromSelection(entry.build.selection, MARKET) : null),
    [entry],
  )
  const specs = useMemo(() => {
    if (!car || !entry) return []
    return car.specOptions.map((group, i) => {
      const choice = resolveSpecChoices(car, entry.build.selection.specChoices)[i]
      return { group: group.name, choice: choice?.name ?? '—' }
    })
  }, [car, entry])

  function refresh() {
    if (!id) return
    const next = getSavedBuild(id) ?? null
    setEntry(next)
    if (next) setNotesDraft(next.notes)
  }

  function show(msg: string) {
    setFlash(msg)
    window.setTimeout(() => setFlash(null), 2200)
  }

  if (!entry || !car) {
    return (
      <div className="sbd">
        <p>Build not found.</p>
        <Link to="/saved">Back to saved builds</Link>
      </div>
    )
  }

  const isOwned = entry.ownership === 'owned'

  function onOwnershipToggle(nextOwned: boolean) {
    if (nextOwned) {
      setRegOpen(true)
      return
    }
    markSavedBuildAsBuild(entry!.id)
    refresh()
    if (tab === 'maintenance') setTab('details')
  }

  function confirmOwned(registration: string) {
    const updated = markSavedBuildOwned(entry!.id, registration)
    setRegOpen(false)
    if (!updated) {
      show('Registration is required to mark as owned')
      return
    }
    refresh()
    show('Marked as owned')
  }

  function saveNotes() {
    updateSavedBuildNotes(entry!.id, notesDraft)
    refresh()
    show('Notes saved')
  }

  function exportMods() {
    requireAccount(() => {
      const ok = downloadModList(entry!.build.selection, {
        filename: `${entry!.name.replace(/\s+/g, '-').toLowerCase()}-mods.csv`,
        format: 'csv',
      })
      show(ok ? 'Mod list downloaded' : 'No mods to export')
    }, 'Create an account to export your mod list.')
  }

  function publishCommunity(e: FormEvent) {
    e.preventDefault()
    if (!entry || entry.ownership !== 'owned') return
    const published = publishOwnedBuild(entry, {
      authorName,
      caption: communityCaption,
    })
    if (!published) {
      show('Could not publish — check the build is complete')
      return
    }
    setPublishedId(published.id)
    show('Uploaded to Community')
  }

  function removeFromCommunity() {
    if (!entry) return
    unpublishBySavedId(entry.id)
    setPublishedId(null)
    show('Removed from Community')
  }

  return (
    <div className="sbd">
      <header className="sbd__head">
        <div>
          <p className="sbd__crumb">
            <Link to="/saved">Saved builds</Link>
          </p>
          <h1>{entry.name}</h1>
          <p className="sbd__meta">
            {selectionLabel(entry.build.selection)}
            {colour ? ` · ${colour.name}` : ''}
            {isOwned && entry.ownedInfo
              ? ` · ${formatRegistration(entry.ownedInfo.registration)}`
              : ''}
          </p>
        </div>
        <div className="sbd__head-actions">
          <div className="sbd__ownership" role="group" aria-label="Build status">
            <button
              type="button"
              className={
                !isOwned
                  ? 'sbd__own-btn sbd__own-btn--active'
                  : 'sbd__own-btn'
              }
              onClick={() => onOwnershipToggle(false)}
            >
              Build
            </button>
            <button
              type="button"
              className={
                isOwned ? 'sbd__own-btn sbd__own-btn--active' : 'sbd__own-btn'
              }
              onClick={() => onOwnershipToggle(true)}
            >
              Owned
            </button>
          </div>
          <div className="sbd__ownership" role="group" aria-label="Profile visibility">
            <button
              type="button"
              className={
                entry.visibility !== 'public'
                  ? 'sbd__own-btn sbd__own-btn--active'
                  : 'sbd__own-btn'
              }
              onClick={() => {
                const next = setBuildVisibility(entry.id, 'private')
                if (next) {
                  setEntry(next)
                  show('Build is private')
                }
              }}
            >
              Private
            </button>
            <button
              type="button"
              className={
                entry.visibility === 'public'
                  ? 'sbd__own-btn sbd__own-btn--active'
                  : 'sbd__own-btn'
              }
              onClick={() => {
                const session = getSession()
                if (!session) {
                  show('Sign in from Account to make builds public')
                  navigate('/account')
                  return
                }
                const next = setBuildVisibility(entry.id, 'public', {
                  userId: session.id,
                  username: session.username,
                })
                if (next) {
                  setEntry(next)
                  show(`Public at /u/${session.username}`)
                }
              }}
            >
              Public
            </button>
          </div>
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={() => navigate(`/builds?saved=${entry.id}`)}
          >
            Edit in wizard
          </button>
        </div>
      </header>

      {flash && (
        <p className="sbd__flash" role="status">
          {flash}
        </p>
      )}

      <nav className="sbd__tabs" aria-label="Build sections">
        {(
          [
            ['details', 'Details & Spec'],
            ['mods', 'Modifications'],
            ['maintenance', 'Maintenance'],
            ['notes', 'Notes'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={tab === id ? 'sbd__tab sbd__tab--active' : 'sbd__tab'}
            onClick={() => setTab(id)}
          >
            {label}
            {id === 'maintenance' && !isOwned ? ' 🔒' : ''}
          </button>
        ))}
      </nav>

      {tab === 'details' && (
        <section className="sbd__panel">
          <h2>Vehicle</h2>
          <dl className="sbd__dl">
            <div>
              <dt>Car</dt>
              <dd>
                {entry.build.selection.year} {car.make} {car.label}
              </dd>
            </div>
            <div>
              <dt>Colour</dt>
              <dd>{colour?.name ?? '—'}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{isOwned ? 'Owned' : 'Build'}</dd>
            </div>
            {figures && (
              <>
                <div>
                  <dt>Power</dt>
                  <dd>{figures.final.hp} hp</dd>
                </div>
                <div>
                  <dt>0–62</dt>
                  <dd>
                    {figures.final.zeroToSixtySec.toFixed(2)}s {accelLabel()}
                  </dd>
                </div>
                <div>
                  <dt>Mods total</dt>
                  <dd>{formatMoney(figures.totalPrice)}</dd>
                </div>
              </>
            )}
          </dl>

          <h2>Factory options</h2>
          {specs.length === 0 ? (
            <p className="sbd__muted">No factory options on this car.</p>
          ) : (
            <ul className="sbd__spec-list">
              {specs.map((row) => (
                <li key={row.group}>
                  <strong>{row.group}</strong>
                  <span>{row.choice}</span>
                </li>
              ))}
            </ul>
          )}

          {isOwned && entry.ownedInfo && (
            <OwnedInfoForm
              info={entry.ownedInfo}
              onSave={(patch) => {
                const updated = updateOwnedVehicleInfo(entry.id, patch)
                if (!updated) {
                  show('Registration cannot be empty')
                  return
                }
                refresh()
                show('Vehicle details saved')
              }}
            />
          )}

          {isOwned ? (
            <form className="sbd__community" onSubmit={publishCommunity}>
              <h2>Community</h2>
              <p className="sbd__muted">
                Upload this owned build so others can browse it and drag race
                against you on the Community tab.
              </p>
              <label>
                Display name
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Sam · Leeds"
                  maxLength={48}
                />
              </label>
              <label>
                Caption (optional)
                <textarea
                  value={communityCaption}
                  onChange={(e) => setCommunityCaption(e.target.value)}
                  rows={2}
                  maxLength={200}
                  placeholder="Stage notes, setup vibe…"
                />
              </label>
              <div className="sbd__row-actions">
                <button type="submit" className="btn btn--primary btn--small">
                  {publishedId ? 'Update community post' : 'Upload to community'}
                </button>
                {publishedId ? (
                  <>
                    <Link to="/community" className="btn btn--ghost btn--small">
                      View Community
                    </Link>
                    <button
                      type="button"
                      className="btn btn--ghost btn--small"
                      onClick={removeFromCommunity}
                    >
                      Remove
                    </button>
                  </>
                ) : null}
              </div>
            </form>
          ) : (
            <p className="sbd__muted">
              Mark this build as Owned to upload it to the Community garage.
            </p>
          )}
        </section>
      )}

      {tab === 'mods' && (
        <section className="sbd__panel">
          <div className="sbd__panel-head">
            <h2>Modifications</h2>
            <div className="sbd__row-actions">
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={exportMods}
              >
                Export mod list
              </button>
              <button
                type="button"
                className="btn btn--primary btn--small"
                onClick={() => navigate(`/builds?saved=${entry.id}`)}
              >
                Edit mods
              </button>
            </div>
          </div>
          {entry.build.selection.modIds.length === 0 ? (
            <p className="sbd__muted">No mods on this build yet.</p>
          ) : (
            <ul className="sbd__mod-list">
              {entry.build.selection.modIds.map((modId) => {
                const mod = catalog.getModById(modId)
                if (!mod) return null
                return (
                  <li key={modId}>
                    <span>
                      {mod.brand} {mod.name}
                    </span>
                    <strong>{formatMoney(mod.price)}</strong>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      )}

      {tab === 'maintenance' && (
        <section className="sbd__panel">
          {!isOwned ? (
            <div className="sbd__locked">
              <h2>Maintenance</h2>
              <p>
                Mark this entry as <strong>Owned</strong> and enter your
                registration to unlock the maintenance log.
              </p>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setRegOpen(true)}
              >
                Mark as owned
              </button>
            </div>
          ) : (
            <MaintenancePanel
              logs={entry.maintenanceLogs}
              buildName={entry.name}
              registration={
                entry.ownedInfo
                  ? formatRegistration(entry.ownedInfo.registration)
                  : undefined
              }
              onAdd={(input) => {
                addMaintenanceLog(entry.id, input)
                refresh()
                show('Log added')
              }}
              onDelete={(logId) => {
                deleteMaintenanceLog(entry.id, logId)
                refresh()
              }}
              onExport={() => {
                const ok = downloadMaintenanceLog(entry.maintenanceLogs, {
                  filename: `${entry.name.replace(/\s+/g, '-').toLowerCase()}-maintenance.csv`,
                })
                show(ok ? 'Maintenance log downloaded' : 'No log entries to export')
              }}
            />
          )}
        </section>
      )}

      {tab === 'notes' && (
        <section className="sbd__panel">
          <h2>Notes</h2>
          <p className="sbd__muted">
            Free-form notes for this build — ideas, sellers, reminders.
          </p>
          <textarea
            className="sbd__notes"
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            rows={12}
            placeholder="Add notes…"
          />
          <div className="sbd__row-actions">
            <button type="button" className="btn btn--primary" onClick={saveNotes}>
              Save notes
            </button>
          </div>
        </section>
      )}

      {regOpen && (
        <RegPromptModal
          initialReg={entry.ownedInfo?.registration ?? ''}
          onCancel={() => setRegOpen(false)}
          onConfirm={confirmOwned}
        />
      )}
    </div>
  )
}

function OwnedInfoForm({
  info,
  onSave,
}: {
  info: NonNullable<SavedBuild['ownedInfo']>
  onSave: (patch: {
    registration: string
    nickname?: string
    purchaseDate?: string
    purchaseMileage?: number | null
    vin?: string
    colourNotes?: string
  }) => void
}) {
  const [registration, setRegistration] = useState(
    formatRegistration(info.registration),
  )
  const [nickname, setNickname] = useState(info.nickname ?? '')
  const [purchaseDate, setPurchaseDate] = useState(info.purchaseDate ?? '')
  const [purchaseMileage, setPurchaseMileage] = useState(
    info.purchaseMileage != null ? String(info.purchaseMileage) : '',
  )
  const [vin, setVin] = useState(info.vin ?? '')
  const [colourNotes, setColourNotes] = useState(info.colourNotes ?? '')

  useEffect(() => {
    setRegistration(formatRegistration(info.registration))
    setNickname(info.nickname ?? '')
    setPurchaseDate(info.purchaseDate ?? '')
    setPurchaseMileage(
      info.purchaseMileage != null ? String(info.purchaseMileage) : '',
    )
    setVin(info.vin ?? '')
    setColourNotes(info.colourNotes ?? '')
  }, [info])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const miles = purchaseMileage.trim()
      ? Number(purchaseMileage.replace(/,/g, ''))
      : null
    onSave({
      registration,
      nickname,
      purchaseDate,
      purchaseMileage: miles != null && Number.isFinite(miles) ? miles : null,
      vin,
      colourNotes,
    })
  }

  return (
    <form className="sbd__owned-form" onSubmit={handleSubmit}>
      <h2>Owned vehicle details</h2>
      <p className="sbd__muted">All fields except registration are optional.</p>
      <label>
        Registration
        <input
          value={registration}
          onChange={(e) => setRegistration(e.target.value.toUpperCase())}
          required
          autoComplete="off"
        />
      </label>
      <label>
        Nickname
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="e.g. Daily"
        />
      </label>
      <label>
        Purchase date
        <input
          type="date"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
        />
      </label>
      <label>
        Purchase mileage
        <input
          inputMode="numeric"
          value={purchaseMileage}
          onChange={(e) => setPurchaseMileage(e.target.value)}
          placeholder="e.g. 42000"
        />
      </label>
      <label>
        VIN
        <input value={vin} onChange={(e) => setVin(e.target.value)} />
      </label>
      <label>
        Colour / trim notes
        <input
          value={colourNotes}
          onChange={(e) => setColourNotes(e.target.value)}
        />
      </label>
      <button type="submit" className="btn btn--primary btn--small">
        Save vehicle details
      </button>
    </form>
  )
}

function MaintenancePanel({
  logs,
  buildName,
  registration,
  onAdd,
  onDelete,
  onExport,
}: {
  logs: MaintenanceLogEntry[]
  buildName: string
  registration?: string
  onAdd: (input: {
    mileage?: number | null
    date?: string | null
    notes?: string
  }) => void
  onDelete: (logId: string) => void
  onExport: () => void
}) {
  const [mileage, setMileage] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    const miles = mileage.trim() ? Number(mileage.replace(/,/g, '')) : null
    onAdd({
      mileage: miles != null && Number.isFinite(miles) ? miles : null,
      date: date || null,
      notes,
    })
    setMileage('')
    setDate('')
    setNotes('')
  }

  const sorted = [...logs].sort((a, b) => {
    const da = a.date || a.createdAt
    const db = b.date || b.createdAt
    return da < db ? 1 : -1
  })

  return (
    <div className="sbd__maint">
      <div className="sbd__panel-head">
        <div>
          <h2>Maintenance log</h2>
          <p className="sbd__muted">
            {buildName}
            {registration ? ` · ${registration}` : ''}. Mileage, date, and notes
            are all optional.
          </p>
        </div>
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={onExport}
          disabled={logs.length === 0}
        >
          Export log
        </button>
      </div>

      <form className="sbd__log-form" onSubmit={handleAdd}>
        <label>
          Mileage
          <input
            inputMode="numeric"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder="Optional"
          />
        </label>
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="sbd__log-notes">
          Notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Oil change, pads, MOT…"
          />
        </label>
        <button type="submit" className="btn btn--primary">
          Add log
        </button>
      </form>

      {sorted.length === 0 ? (
        <p className="sbd__muted">No maintenance entries yet.</p>
      ) : (
        <ul className="sbd__log-list">
          {sorted.map((log) => (
            <li key={log.id}>
              <div className="sbd__log-top">
                <strong>
                  {log.date
                    ? new Date(log.date + 'T12:00:00').toLocaleDateString('en-GB')
                    : 'No date'}
                </strong>
                <span>
                  {log.mileage != null
                    ? `${log.mileage.toLocaleString('en-GB')} mi`
                    : 'No mileage'}
                </span>
                <button
                  type="button"
                  className="btn btn--ghost btn--small"
                  onClick={() => onDelete(log.id)}
                >
                  Delete
                </button>
              </div>
              {log.notes ? <p>{log.notes}</p> : (
                <p className="sbd__muted">No notes</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
