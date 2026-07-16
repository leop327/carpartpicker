import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DragRace } from '../components/builds/DragRace'
import { formatMoney } from '../lib/build'
import {
  listCommunityBuilds,
  type CommunityBuild,
} from '../lib/community'
import { listSavedBuilds } from '../lib/savedBuilds'
import './CommunityPage.css'

export function CommunityPage() {
  const [builds] = useState(() => listCommunityBuilds())
  const [selectedId, setSelectedId] = useState<string | null>(
    () => builds[0]?.id ?? null,
  )
  const [challengerId, setChallengerId] = useState<string | null>(null)
  const [raceVsId, setRaceVsId] = useState<string | null>(null)

  const owned = useMemo(
    () => listSavedBuilds().filter((b) => b.ownership === 'owned'),
    [],
  )

  const selected = builds.find((b) => b.id === selectedId) ?? builds[0]
  const raceOpponent =
    (raceVsId && builds.find((b) => b.id === raceVsId)) ||
    builds.find((b) => b.id !== selected?.id) ||
    null

  function pickRace(opponentId: string) {
    setRaceVsId(opponentId)
    setChallengerId(selected?.id ?? null)
  }

  return (
    <div className="community">
      <header className="community__hero">
        <h1>Community</h1>
        <p>
          Browse builds from the garage. Race 0–62 against another setup. Upload
          your owned car from a saved build.
        </p>
        {owned.length === 0 ? (
          <p className="community__hint">
            Mark a saved build as <strong>Owned</strong> (with registration),
            then publish it from the build page.{' '}
            <Link to="/saved">Open saved builds</Link>
          </p>
        ) : (
          <p className="community__hint">
            You have {owned.length} owned build{owned.length === 1 ? '' : 's'}.{' '}
            <Link to={`/saved/${owned[0].id}`}>Publish from your garage</Link>
          </p>
        )}
      </header>

      {selected && raceOpponent && challengerId === selected.id ? (
        <section className="community__race" aria-labelledby="community-race">
          <h2 id="community-race">Drag race</h2>
          <DragRace
            title={`${selected.title} vs ${raceOpponent.title}`}
            left={{
              id: selected.id,
              label: selected.title,
              sublabel: `${selected.snapshot.hp} hp · ${selected.authorName}`,
              image: selected.snapshot.image,
              zeroToSixtySec: selected.snapshot.zeroToSixtySec,
              accent: selected.snapshot.colourHex,
            }}
            right={{
              id: raceOpponent.id,
              label: raceOpponent.title,
              sublabel: `${raceOpponent.snapshot.hp} hp · ${raceOpponent.authorName}`,
              image: raceOpponent.snapshot.image,
              zeroToSixtySec: raceOpponent.snapshot.zeroToSixtySec,
              accent: raceOpponent.snapshot.colourHex,
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
                onSelect={() => {
                  setSelectedId(build.id)
                  setChallengerId(null)
                }}
                onRace={() => {
                  setSelectedId(build.id)
                  const opponent =
                    builds.find((b) => b.id !== build.id) ?? null
                  if (opponent) pickRace(opponent.id)
                }}
                opponents={builds.filter((b) => b.id !== build.id)}
                onRaceVs={(id) => {
                  setSelectedId(build.id)
                  pickRace(id)
                }}
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
  onSelect,
  onRace,
  opponents,
  onRaceVs,
}: {
  build: CommunityBuild
  selected: boolean
  onSelect: () => void
  onRace: () => void
  opponents: CommunityBuild[]
  onRaceVs: (id: string) => void
}) {
  const [pickOpen, setPickOpen] = useState(false)
  const s = build.snapshot

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
              <dt>0–62</dt>
              <dd>{s.zeroToSixtySec.toFixed(2)}s</dd>
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
        <button type="button" className="btn btn--primary btn--small" onClick={onRace}>
          Race someone
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={() => setPickOpen((v) => !v)}
          aria-expanded={pickOpen}
        >
          Pick opponent
        </button>
      </div>
      {pickOpen ? (
        <ul className="community-card__opponents">
          {opponents.map((o) => (
            <li key={o.id}>
              <button
                type="button"
                onClick={() => {
                  onRaceVs(o.id)
                  setPickOpen(false)
                }}
              >
                vs {o.title}{' '}
                <span>{o.snapshot.zeroToSixtySec.toFixed(2)}s</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}
