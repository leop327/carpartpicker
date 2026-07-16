import { useState } from 'react'
import { Link } from 'react-router-dom'
import { catalog } from '../data/catalog'
import { DragRace } from '../components/builds/DragRace'
import { formatMoney } from '../lib/build'
import {
  listCommunityBuilds,
  type CommunityBuild,
} from '../lib/community'
import { estimateQuarterMileSec } from '../lib/quarterMile'
import { figuresFromSelection } from '../lib/selection'
import { MARKET } from '../lib/market'
import {
  listSavedBuilds,
  selectionLabel,
  type SavedBuild,
} from '../lib/savedBuilds'
import './CommunityPage.css'

function etForSnapshot(s: CommunityBuild['snapshot']): number {
  if (typeof s.quarterMileSec === 'number' && Number.isFinite(s.quarterMileSec)) {
    return s.quarterMileSec
  }
  return estimateQuarterMileSec({
    hp: s.hp,
    weightKg: s.weightKg,
    zeroToSixtySec: s.zeroToSixtySec,
  })
}

function etForOwned(build: SavedBuild): number | null {
  const figures = figuresFromSelection(build.build.selection, MARKET)
  if (!figures) return null
  return estimateQuarterMileSec(figures.final)
}

function imageForOwned(build: SavedBuild): string | undefined {
  const carId = build.build.selection.carId
  return carId ? catalog.getCarById(carId)?.image : undefined
}

export function CommunityPage() {
  const [builds] = useState(() => listCommunityBuilds())
  const [owned] = useState(() =>
    listSavedBuilds().filter((b) => b.ownership === 'owned'),
  )
  const [selectedId, setSelectedId] = useState<string | null>(
    () => builds[0]?.id ?? null,
  )
  const [raceOpponentId, setRaceOpponentId] = useState<string | null>(null)
  const [myRacerId, setMyRacerId] = useState<string | null>(null)
  const [pickingForId, setPickingForId] = useState<string | null>(null)

  const selected = builds.find((b) => b.id === selectedId) ?? builds[0]
  const opponent = raceOpponentId
    ? builds.find((b) => b.id === raceOpponentId)
    : null
  const myBuild = myRacerId
    ? owned.find((b) => b.id === myRacerId)
    : null

  const myEt = myBuild ? etForOwned(myBuild) : null
  const oppEt = opponent ? etForSnapshot(opponent.snapshot) : null

  function startPick(communityId: string) {
    setSelectedId(communityId)
    setPickingForId(communityId)
    setRaceOpponentId(null)
    setMyRacerId(null)
  }

  function chooseMyBuild(ownedId: string) {
    if (!pickingForId) return
    setMyRacerId(ownedId)
    setRaceOpponentId(pickingForId)
    setPickingForId(null)
  }

  return (
    <div className="community">
      <header className="community__hero">
        <h1>Community</h1>
        <p>
          Browse garage builds. Challenge any of them to a 1/4-mile with one of
          your owned cars.
        </p>
        {owned.length === 0 ? (
          <p className="community__hint">
            Mark a saved build as <strong>Owned</strong> (with registration) to
            race. <Link to="/saved">Open saved builds</Link>
          </p>
        ) : (
          <p className="community__hint">
            You have {owned.length} owned build{owned.length === 1 ? '' : 's'}{' '}
            ready to race.{' '}
            <Link to={`/saved/${owned[0].id}`}>Publish from your garage</Link>
          </p>
        )}
      </header>

      {opponent && myBuild && myEt != null && oppEt != null ? (
        <section className="community__race" aria-labelledby="community-race">
          <h2 id="community-race">1/4-mile drag race</h2>
          <DragRace
            timesBeside
            title={`${myBuild.name} vs ${opponent.title}`}
            left={{
              id: myBuild.id,
              label: myBuild.name,
              sublabel: `${selectionLabel(myBuild.build.selection)} · you`,
              image: imageForOwned(myBuild),
              quarterMileSec: myEt,
              accent: 'var(--signal)',
            }}
            right={{
              id: opponent.id,
              label: opponent.title,
              sublabel: `${opponent.snapshot.hp} hp · ${opponent.authorName}`,
              image: opponent.snapshot.image,
              quarterMileSec: oppEt,
              accent: opponent.snapshot.colourHex,
            }}
          />
        </section>
      ) : null}

      <section className="community__feed" aria-labelledby="community-feed">
        <h2 id="community-feed">Builds</h2>
        <ul className="community__list">
          {builds.map((build) => (
            <li key={build.id}>
              <CommunityCard
                build={build}
                selected={build.id === selected?.id}
                owned={owned}
                picking={pickingForId === build.id}
                onSelect={() => {
                  setSelectedId(build.id)
                  setPickingForId(null)
                }}
                onDragRace={() => startPick(build.id)}
                onPickOwned={chooseMyBuild}
                onCancelPick={() => setPickingForId(null)}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function CommunityCard({
  build,
  selected,
  owned,
  picking,
  onSelect,
  onDragRace,
  onPickOwned,
  onCancelPick,
}: {
  build: CommunityBuild
  selected: boolean
  owned: SavedBuild[]
  picking: boolean
  onSelect: () => void
  onDragRace: () => void
  onPickOwned: (id: string) => void
  onCancelPick: () => void
}) {
  const s = build.snapshot
  const et = etForSnapshot(s)

  return (
    <article
      className={
        selected ? 'community-card community-card--selected' : 'community-card'
      }
    >
      <button type="button" className="community-card__main" onClick={onSelect}>
        <div className="community-card__media">
          <img src={s.image} alt="" />
          <span
            className="community-card__swatch"
            style={{ background: s.colourHex }}
            title={s.colourName}
          />
        </div>
        <div className="community-card__body">
          <p className="community-card__author">{build.authorName}</p>
          <h3>{build.title}</h3>
          <p className="community-card__car">
            {s.year} {s.carLabel} · {s.colourName}
          </p>
          {build.caption ? (
            <p className="community-card__caption">{build.caption}</p>
          ) : null}
          <dl className="community-card__stats">
            <div>
              <dt>Power</dt>
              <dd>{s.hp} hp</dd>
            </div>
            <div>
              <dt>1/4-mile</dt>
              <dd>{et.toFixed(2)}s</dd>
            </div>
            <div>
              <dt>Mods</dt>
              <dd>
                {s.modCount} · {formatMoney(s.modsPrice)}
              </dd>
            </div>
          </dl>
          {s.modLabels.length > 0 ? (
            <p className="community-card__mods">
              {s.modLabels.slice(0, 4).join(' · ')}
              {s.modLabels.length > 4
                ? ` · +${s.modLabels.length - 4} more`
                : ''}
            </p>
          ) : (
            <p className="community-card__mods">Stock</p>
          )}
        </div>
      </button>
      <div className="community-card__actions">
        <button
          type="button"
          className="btn btn--primary btn--small"
          onClick={onDragRace}
        >
          Drag race
        </button>
      </div>
      {picking ? (
        <div className="community-card__pick">
          <p className="community-card__pick-label">
            {owned.length === 0
              ? 'You need an owned build to race.'
              : 'Pick one of your owned builds:'}
          </p>
          {owned.length === 0 ? (
            <Link to="/saved" className="btn btn--ghost btn--small">
              Go to saved builds
            </Link>
          ) : (
            <ul className="community-card__opponents">
              {owned.map((o) => {
                const oEt = etForOwned(o)
                return (
                  <li key={o.id}>
                    <button type="button" onClick={() => onPickOwned(o.id)}>
                      {o.name}{' '}
                      <span>
                        {oEt != null ? `${oEt.toFixed(2)}s ET` : '—'}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={onCancelPick}
          >
            Cancel
          </button>
        </div>
      ) : null}
    </article>
  )
}
