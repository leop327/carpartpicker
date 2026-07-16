import { Link, useNavigate } from 'react-router-dom'
import { catalog } from '../data/catalog'
import {
  clearBuildStorage,
  emptySelection,
  writeBuildToStorage,
} from '../lib/buildState'
import {
  deleteSavedBuild,
  listSavedBuilds,
  renameSavedBuild,
  selectionLabel,
  type SavedBuild,
} from '../lib/savedBuilds'
import {
  buildSummaryText,
  openPrintableSummary,
} from '../lib/selection'
import { getMarket, setMarket } from '../lib/market'
import type { Market } from '../types/catalog'
import { useMemo, useState } from 'react'
import './HomePage.css'

export function HomePage() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(() => listSavedBuilds())
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [market, setMarketState] = useState<Market>(() => getMarket())

  const savedRows = useMemo(() => saved, [saved])

  function refresh() {
    setSaved(listSavedBuilds())
  }

  function startNewBuild() {
    clearBuildStorage()
    writeBuildToStorage({
      v: 2,
      stage: 'brand',
      selection: emptySelection(),
    })
    navigate('/builds?new=1')
  }

  function openSaved(id: string) {
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

  function exportBuild(item: SavedBuild) {
    const text = buildSummaryText(item.build.selection, market)
    if (!text) return
    openPrintableSummary(text, item.name)
  }

  function changeMarket(next: Market) {
    setMarket(next)
    setMarketState(next)
  }

  function goCompare() {
    if (compareIds.length !== 2) return
    navigate(`/compare?a=${compareIds[0]}&b=${compareIds[1]}`)
  }

  return (
    <div className="start">
      <section className="start__hero">
        <p className="start__brand">CarPartPicker</p>
        <p className="start__tagline">
          Configure the car. Add the mods. See the numbers.
        </p>
        <button
          type="button"
          className="btn btn--primary btn--lg"
          onClick={startNewBuild}
        >
          Create new build
        </button>
        <div className="start__market" role="group" aria-label="Market">
          <span>Figures market</span>
          <button
            type="button"
            className={
              market === 'us' ? 'mods-chip mods-chip--active' : 'mods-chip'
            }
            onClick={() => changeMarket('us')}
          >
            US
          </button>
          <button
            type="button"
            className={
              market === 'eu' ? 'mods-chip mods-chip--active' : 'mods-chip'
            }
            onClick={() => changeMarket('eu')}
          >
            EU
          </button>
        </div>
      </section>

      <section className="start__saved" aria-labelledby="saved-heading">
        <div className="start__saved-head">
          <h2 id="saved-heading">Saved builds</h2>
          {savedRows.length === 0 ? (
            <p className="start__muted">
              Nothing saved yet — create a build to see it here.
            </p>
          ) : (
            <p className="start__muted">
              Select two builds to compare. Rename or export anytime.
            </p>
          )}
        </div>

        {compareIds.length > 0 && (
          <div className="start__compare-bar">
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

        {savedRows.length > 0 && (
          <ul className="start__list">
            {savedRows.map((item) => {
              const car = item.build.selection.carId
                ? catalog.getCarById(item.build.selection.carId)
                : undefined
              const colour = car?.colours.find(
                (c) => c.id === item.build.selection.colourId,
              )
              const checked = compareIds.includes(item.id)
              const isRenaming = renamingId === item.id
              return (
                <li key={item.id} className="start__row">
                  <label className="start__compare">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCompare(item.id)}
                      aria-label={`Compare ${item.name}`}
                    />
                  </label>
                  {isRenaming ? (
                    <form
                      className="start__rename"
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
                      className="start__row-main"
                      onClick={() => openSaved(item.id)}
                    >
                      <span className="start__row-title">{item.name}</span>
                      <span className="start__row-meta">
                        {selectionLabel(item.build.selection)}
                        {colour ? ` · ${colour.name}` : ''}
                        {item.build.selection.modIds.length
                          ? ` · ${item.build.selection.modIds.length} mods`
                          : ''}
                      </span>
                    </button>
                  )}
                  <div className="start__row-actions">
                    {!isRenaming && (
                      <>
                        <button
                          type="button"
                          className="start__row-action"
                          onClick={() => startRename(item)}
                        >
                          Rename
                        </button>
                        <button
                          type="button"
                          className="start__row-action"
                          onClick={() => exportBuild(item)}
                        >
                          Export
                        </button>
                        <button
                          type="button"
                          className="start__row-delete"
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
      </section>

      <p className="start__footer-link">
        <Link to="/builds">Continue current draft</Link>
      </p>
    </div>
  )
}
