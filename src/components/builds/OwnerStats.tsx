import { useEffect, useState } from 'react'
import {
  claimOwnership,
  getOwnerCount,
  getPopularModsForCar,
  hasClaimedCar,
  unclaimOwnership,
} from '../../lib/owners'
import './OwnerStats.css'

interface Props {
  carId: string
  carLabel: string
}

export function OwnerStats({ carId, carLabel }: Props) {
  const [count, setCount] = useState(() => getOwnerCount(carId))
  const [claimed, setClaimed] = useState(() => hasClaimedCar(carId))
  const [popular, setPopular] = useState(() => getPopularModsForCar(carId, 4))

  useEffect(() => {
    function refresh() {
      setCount(getOwnerCount(carId))
      setClaimed(hasClaimedCar(carId))
      setPopular(getPopularModsForCar(carId, 4))
    }
    refresh()
    window.addEventListener('cpp:owners-changed', refresh)
    return () => window.removeEventListener('cpp:owners-changed', refresh)
  }, [carId])

  function toggleClaim() {
    if (claimed) unclaimOwnership(carId)
    else claimOwnership(carId)
  }

  return (
    <aside className="owner-stats" aria-label="Owner stats">
      <div className="owner-stats__count">
        <strong>{count.toLocaleString('en-GB')}</strong>
        <span>owners tracking {carLabel}</span>
      </div>
      <button
        type="button"
        className={
          claimed ? 'btn btn--primary btn--small' : 'btn btn--ghost btn--small'
        }
        onClick={toggleClaim}
      >
        {claimed ? 'You have this car' : 'I have this car'}
      </button>
      {popular.length > 0 && (
        <div className="owner-stats__popular">
          <span className="hud-label">Popular mods</span>
          <ul>
            {popular.map((p) => (
              <li key={p.modId}>
                {p.label} <em>{p.count}</em>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}
