import { Link, useSearchParams } from 'react-router-dom'
import { catalog } from '../data/catalog'
import { getSavedBuild } from '../lib/savedBuilds'
import { figuresFromSelection } from '../lib/selection'
import { formatMoney, figuresSourceLabel } from '../lib/build'
import { accelLabel, getMarket } from '../lib/market'
import { FiguresGrid } from '../components/builds/FiguresGrid'
import './ComparePage.css'

export function ComparePage() {
  const [params] = useSearchParams()
  const aId = params.get('a')
  const bId = params.get('b')
  const market = getMarket()

  const a = aId ? getSavedBuild(aId) : undefined
  const b = bId ? getSavedBuild(bId) : undefined

  if (!a || !b) {
    return (
      <div className="compare">
        <h1>Compare builds</h1>
        <p>Pick two saved builds from Home to compare.</p>
        <Link to="/">Back home</Link>
      </div>
    )
  }

  const aCar = a.build.selection.carId
    ? catalog.getCarById(a.build.selection.carId)
    : undefined
  const bCar = b.build.selection.carId
    ? catalog.getCarById(b.build.selection.carId)
    : undefined
  const aFigures = figuresFromSelection(a.build.selection, market)
  const bFigures = figuresFromSelection(b.build.selection, market)

  return (
    <div className="compare">
      <header className="compare__header">
        <div>
          <p className="compare__eyebrow">
            <Link to="/">Home</Link>
          </p>
          <h1>Compare builds</h1>
          <p className="compare__market">Market: {market.toUpperCase()}</p>
        </div>
      </header>

      <div className="compare__grid">
        {[
          { saved: a, car: aCar, figures: aFigures },
          { saved: b, car: bCar, figures: bFigures },
        ].map(({ saved, car, figures }) => {
          const colour = car?.colours.find(
            (c) => c.id === saved.build.selection.colourId,
          )
          return (
            <article key={saved.id} className="compare__card">
              {car && (
                <img
                  className="compare__photo"
                  src={car.image}
                  alt=""
                  loading="lazy"
                />
              )}
              <h2>{saved.name}</h2>
              <p className="compare__meta">
                {saved.build.selection.year} {car?.make} {car?.label}
                {colour ? ` · ${colour.name}` : ''}
              </p>
              {figures && car && (
                <>
                  <FiguresGrid
                    title="Final figures"
                    figures={figures.final}
                    accelLabel={accelLabel(market)}
                    sourceNote={figuresSourceLabel(car.figuresSource)}
                  />
                  <p className="compare__price">
                    {formatMoney(figures.totalPrice)}
                  </p>
                </>
              )}
              <ul className="compare__mods">
                {saved.build.selection.modIds.map((id) => {
                  const mod = catalog.getModById(id)
                  return (
                    <li key={id}>
                      {mod ? `${mod.brand} ${mod.name}` : id}
                    </li>
                  )
                })}
                {saved.build.selection.modIds.length === 0 && (
                  <li>No mods</li>
                )}
              </ul>
              <Link className="btn btn--ghost btn--small" to={`/builds?saved=${saved.id}`}>
                Open build
              </Link>
            </article>
          )
        })}
      </div>

      {aFigures && bFigures && (
        <section className="compare__delta" aria-labelledby="delta-title">
          <h2 id="delta-title">Delta (A → B)</h2>
          <dl>
            <div>
              <dt>Power</dt>
              <dd>
                {fmtDelta(bFigures.final.hp - aFigures.final.hp)} hp
              </dd>
            </div>
            <div>
              <dt>Torque</dt>
              <dd>
                {fmtDelta(bFigures.final.torqueNm - aFigures.final.torqueNm)} Nm
              </dd>
            </div>
            <div>
              <dt>{accelLabel(market)}</dt>
              <dd>
                {fmtDelta(
                  bFigures.final.zeroToSixtySec - aFigures.final.zeroToSixtySec,
                  true,
                )}{' '}
                s
              </dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>
                {fmtDelta(bFigures.final.weightKg - aFigures.final.weightKg)} kg
              </dd>
            </div>
            <div>
              <dt>Price</dt>
              <dd>
                {fmtDelta(bFigures.totalPrice - aFigures.totalPrice, false, true)}
              </dd>
            </div>
          </dl>
        </section>
      )}
    </div>
  )
}

function fmtDelta(n: number, invert = false, money = false) {
  const sign = n > 0 ? '+' : ''
  if (money) {
    return `${sign}${formatMoney(n)}`
  }
  const better = invert ? n < 0 : n > 0
  const text =
    Math.abs(n) >= 10 ? `${sign}${Math.round(n)}` : `${sign}${n.toFixed(2)}`
  return better ? text : text
}
