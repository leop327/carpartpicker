import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { catalog } from '../data/catalog'
import {
  getAccountByUsername,
  getSession,
  listPublicBuildsForUser,
} from '../lib/auth'
import { formatMoney } from '../lib/build'
import { figuresFromSelection } from '../lib/selection'
import { MARKET } from '../lib/market'
import './StaticPage.css'
import './PublicProfilePage.css'

export function PublicProfilePage() {
  const { username = '' } = useParams()
  const account = useMemo(
    () => getAccountByUsername(username),
    [username],
  )
  const builds = useMemo(
    () => (account ? listPublicBuildsForUser(account.username) : []),
    [account],
  )
  const session = getSession()
  const isSelf = session?.username === account?.username

  if (!account) {
    return (
      <div className="static">
        <h1>Profile not found</h1>
        <p className="static__lead">
          No public account for <strong>{username}</strong>.
        </p>
        <Link to="/account">Create an account</Link>
      </div>
    )
  }

  return (
    <div className="profile-public">
      <header className="profile-public__head">
        <p className="hud-label">Builder</p>
        <h1>{account.displayName}</h1>
        <p>@{account.username}</p>
        {isSelf && (
          <p className="profile-public__hint">
            This is you. Mark builds public from{' '}
            <Link to="/saved">My builds</Link>.
          </p>
        )}
      </header>

      {builds.length === 0 ? (
        <p className="profile-public__empty">No public builds yet.</p>
      ) : (
        <ul className="profile-public__grid">
          {builds.map((build) => {
            const carId = build.build.selection.carId
            const car = carId ? catalog.getCarById(carId) : undefined
            const figures = figuresFromSelection(build.build.selection, MARKET)
            return (
              <li key={build.id}>
                <Link to={`/saved/${build.id}`} className="profile-public__card">
                  {car?.image ? (
                    <img src={car.image} alt="" />
                  ) : (
                    <div className="profile-public__ph" />
                  )}
                  <div>
                    <strong>{build.name}</strong>
                    <span>
                      {figures
                        ? `${figures.final.hp} hp · ${formatMoney(figures.modsPrice)}`
                        : car?.label}
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
