import { Link, useNavigate } from 'react-router-dom'
import { catalog } from '../data/catalog'
import {
  clearBuildStorage,
  emptySelection,
  writeBuildToStorage,
} from '../lib/buildState'
import {
  deleteSavedBuild,
  formatRegistration,
  listSavedBuilds,
  markSavedBuildAsBuild,
  markSavedBuildOwned,
  renameSavedBuild,
  selectionLabel,
  type SavedBuild,
} from '../lib/savedBuilds'
import { downloadModList } from '../lib/exportMods'
import { RegPromptModal } from '../components/saved/RegPromptModal'
import { useMemo, useState } from 'react'
import './SavedBuildsPage.css'

export function SavedBuildsPage() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(() => listSavedBuilds())
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [note, setNote] = useState<string | null>(null)
  const [regPromptId, setRegPromptId] = useState<string | null>(null)

  const rows = useMemo(() => saved, [saved])
  const regTarget = regPromptId
    ? saved.find((b) => b.id === regPromptId)
    : undefined

  function refresh() {
    setSaved(listSavedBuilds())
  }

  function flash(msg: string) {
    setNote(msg)
    window.setTimeout(() => setNote(null), 2200)
  }

  function openBuild(id: string) {
    navigate(`/saved/${id}`)
  }

  function editInWizard(id: string) {
    navigate(`/builds?saved=${id}`)
  }

  function removeSaved(id: string) {
    deleteSavedBuild(id)
    setCompareIds((prev) => prev.filter((x) => x !== id))
    refresh()
  }

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 2) return [prev[1], id]
      return [...prev, id]
    })
  }

  function startRename(item: SavedBuild) {
    setRenamingId(item.id)
    setRenameValue(item.name)
  }

  function commitRename() {
    if (!renamingId) return
    renameSavedBuild(renamingId, renameValue)
    setRenamingId(null)
    refresh()
  }

  function exportMods(item: SavedBuild) {
    const ok = downloadModList(item.build.selection, {
      filename: `${item.name.replace(/\s+/g, '-').toLowerCase()}-mods.csv`,
      format: 'csv',
    })
    flash(ok ? 'Mod list downloaded' : 'No mods to export')
  }

  function requestOwned(id: string) {
    setRegPromptId(id)
  }

  function confirmOwned(registration: string) {
    if (!regPromptId) return
    const updated = markSavedBuildOwned(regPromptId, registration)
    setRegPromptId(null)
    if (!updated) {
      flash('Registration required — stayed as build')
      refresh()
      return
    }
    refresh()
    flash('Marked as owned')
  }

  function cancelOwnedPrompt() {
    setRegPromptId(null)
    flash('Stayed as build')
  }

  function setAsBuild(id: string) {
    markSavedBuildAsBuild(id)
    refresh()
  }

  function goCompare() {
    if (compareIds.length !== 2) return
    navigate(`/compare?a=${compareIds[0]}&b=${compareIds[1]}`)
  }

  function startNew() {
    clearBuildStorage()
    writeBuildToStorage({
      v: 2,
      stage: 'series',
      selection: emptySelection(),
    })
    navigate('/builds?new=1')
  }

  return (
    <div className="saved-page">
      <header className="saved-page__head">
        <div>
          <h1>Saved builds</h1>
          <p>
            Builds and owned cars in one place. Toggle to Owned (needs a reg) for
            maintenance logging.
          </p>
        </div>
        <button type="button" className="btn btn--primary" onClick={startNew}>
          New build
        </button>
      </header>

      {note && (
        <p className="saved-page__note" role="status">
          {note}
        </p>
      )}

      {compareIds.length > 0 && (
        <div className="saved-page__compare-bar">
          <span>
            {compareIds.length === 1
              ? 'Select one more build to compare'
              : 'Ready to compare'}
          </span>
          <button
            type="button"
            className="btn btn--primary btn--small"
            disabled={compareIds.length !== 2}
            onClick={goCompare}
          >
            Compare
          </button>
        </div>
      )}

      {rows.length === 0 ? (
        <p className="saved-page__empty">
          Nothing saved yet. <Link to="/builds?new=1">Create a build</Link> and
          hit Save.
        </p>
      ) : (
        <ul className="saved-page__list">
          {rows.map((item) => {
            const car = item.build.selection.carId
              ? catalog.getCarById(item.build.selection.carId)
              : undefined
            const colour = car?.colours.find(
              (c) => c.id === item.build.selection.colourId,
            )
            const checked = compareIds.includes(item.id)
            const isRenaming = renamingId === item.id
            const isOwned = item.ownership === 'owned'
            return (
              <li key={item.id} className="saved-page__row">
                <label className="saved-page__compare">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCompare(item.id)}
                    aria-label={`Compare ${item.name}`}
                  />
                </label>
                {isRenaming ? (
                  <form
                    className="saved-page__rename"
                    onSubmit={(e) => {
                      e.preventDefault()
                      commitRename()
                    }}
                  >
                    <input
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      autoFocus
                    />
                    <button type="submit" className="btn btn--small btn--primary">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn--small btn--ghost"
                      onClick={() => setRenamingId(null)}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    className="saved-page__main"
                    onClick={() => openBuild(item.id)}
                  >
                    <span className="saved-page__title-row">
                      <span className="saved-page__title">{item.name}</span>
                      <span
                        className={
                          isOwned
                            ? 'saved-page__badge saved-page__badge--owned'
                            : 'saved-page__badge'
                        }
                      >
                        {isOwned ? 'Owned' : 'Build'}
                      </span>
                    </span>
                    <span className="saved-page__meta">
                      {selectionLabel(item.build.selection)}
                      {colour ? ` · ${colour.name}` : ''}
                      {item.build.selection.modIds.length
                        ? ` · ${item.build.selection.modIds.length} mods`
                        : ''}
                      {isOwned && item.ownedInfo
                        ? ` · ${formatRegistration(item.ownedInfo.registration)}`
                        : ''}
                    </span>
                  </button>
                )}
                <div className="saved-page__actions">
                  {!isRenaming && (
                    <>
                      <div
                        className="saved-page__ownership"
                        role="group"
                        aria-label={`${item.name} status`}
                      >
                        <button
                          type="button"
                          className={
                            !isOwned
                              ? 'saved-page__own-btn saved-page__own-btn--active'
                              : 'saved-page__own-btn'
                          }
                          onClick={() => setAsBuild(item.id)}
                        >
                          Build
                        </button>
                        <button
                          type="button"
                          className={
                            isOwned
                              ? 'saved-page__own-btn saved-page__own-btn--active'
                              : 'saved-page__own-btn'
                          }
                          onClick={() => requestOwned(item.id)}
                        >
                          Owned
                        </button>
                      </div>
                      <button
                        type="button"
                        className="btn btn--small btn--primary"
                        onClick={() => openBuild(item.id)}
                      >
                        Open
                      </button>
                      <button
                        type="button"
                        className="btn btn--small btn--ghost"
                        onClick={() => editInWizard(item.id)}
                      >
                        Edit parts
                      </button>
                      <button
                        type="button"
                        className="btn btn--small btn--ghost"
                        onClick={() => startRename(item)}
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        className="btn btn--small btn--ghost"
                        onClick={() => exportMods(item)}
                      >
                        Export mods
                      </button>
                      <button
                        type="button"
                        className="btn btn--small btn--ghost"
                        onClick={() => removeSaved(item.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {regPromptId && (
        <RegPromptModal
          initialReg={regTarget?.ownedInfo?.registration ?? ''}
          onCancel={cancelOwnedPrompt}
          onConfirm={confirmOwned}
        />
      )}
    </div>
  )
}
