import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { catalog } from '../data/catalog'
import { FitmentVotes } from '../components/builds/FitmentVotes'
import { ReportIncorrect } from '../components/report/ReportIncorrect'
import { formatMoney } from '../lib/build'
import { openAffiliateProduct } from '../lib/affiliates'
import type { ReportTarget } from '../lib/report'
import './ProductPage.css'

export function ProductPage() {
  const { modId = '' } = useParams()
  const mod = useMemo(() => catalog.getModById(modId), [modId])
  const [reportOpen, setReportOpen] = useState(false)
  const category = mod
    ? catalog.modCategories.find((c) => c.id === mod.category)
    : undefined

  const fitmentCars = useMemo(() => {
    if (!mod) return []
    return catalog.cars.filter((car) =>
      catalog.getModsForCar(car.modTags).some((m) => m.id === mod.id),
    )
  }, [mod])

  const [voteCarId, setVoteCarId] = useState('')
  const activeCarId = voteCarId || fitmentCars[0]?.id || ''

  if (!mod) {
    return (
      <div className="product">
        <h1>Product not found</h1>
        <p>
          No mod with id <code>{modId}</code>.
        </p>
        <Link to="/builds">Back to builds</Link>
      </div>
    )
  }

  const reportTarget: ReportTarget = {
    kind: 'mod',
    modId: mod.id,
    label: `${mod.brand} ${mod.name}`,
  }

  function buy() {
    if (!mod) return
    const url = catalog.resolveProductUrl(mod, { affiliate: false })
    const wrapped = openAffiliateProduct({
      modId: mod.id,
      brand: mod.brand,
      url,
      source: 'product-profile',
    })
    window.open(wrapped, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="product">
      <p className="product__crumb">
        <Link to="/builds">Builds</Link>
        <span aria-hidden> / </span>
        <span>{category?.name ?? mod.category}</span>
      </p>

      <header className="product__head">
        <p className="hud-label">{mod.brand}</p>
        <h1>{mod.name}</h1>
        {catalog.resolveProductImage(mod) && (
          <div className="product__media">
            <img
              src={catalog.resolveProductImage(mod)}
              alt={`${mod.brand} ${mod.name}`}
            />
          </div>
        )}
        <p className="product__price">{formatMoney(mod.price)}</p>
        <p className="product__desc">{mod.description}</p>
        {mod.claim && <p className="product__claim">{mod.claim}</p>}
      </header>

      <dl className="product__facts">
        <div>
          <dt>Category</dt>
          <dd>{category?.name ?? mod.category}</dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>{mod.figuresSource ?? 'estimated'}</dd>
        </div>
        {(mod.figuresDelta.hp ||
          mod.figuresDelta.torqueNm ||
          mod.figuresDelta.zeroToSixtySec) && (
          <div>
            <dt>Figures delta</dt>
            <dd>
              {[
                mod.figuresDelta.hp
                  ? `${mod.figuresDelta.hp > 0 ? '+' : ''}${mod.figuresDelta.hp} hp`
                  : null,
                mod.figuresDelta.torqueNm
                  ? `${mod.figuresDelta.torqueNm > 0 ? '+' : ''}${mod.figuresDelta.torqueNm} Nm`
                  : null,
                mod.figuresDelta.zeroToSixtySec
                  ? `${mod.figuresDelta.zeroToSixtySec > 0 ? '+' : ''}${mod.figuresDelta.zeroToSixtySec.toFixed(2)}s`
                  : null,
              ]
                .filter(Boolean)
                .join(' · ')}
            </dd>
          </div>
        )}
      </dl>

      <div className="product__actions">
        <button type="button" className="btn btn--primary" onClick={buy}>
          Buy
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setReportOpen(true)}
        >
          Report incorrect info
        </button>
      </div>

      <section className="product__fitment" aria-labelledby="fitment-heading">
        <h2 id="fitment-heading">Fitment</h2>
        <p>Did this fit your car? Votes stay on this device for now.</p>
        {fitmentCars.length > 0 && (
          <label className="product__car-pick">
            Your car
            <select
              value={activeCarId}
              onChange={(e) => setVoteCarId(e.target.value)}
            >
              {fitmentCars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.make} {car.label} ({car.generation})
                </option>
              ))}
            </select>
          </label>
        )}
        {activeCarId ? (
          <FitmentVotes carId={activeCarId} modId={mod.id} />
        ) : (
          <p>No compatible cars in the current catalogue focus.</p>
        )}
      </section>

      {reportOpen && (
        <ReportIncorrect
          target={reportTarget}
          onClose={() => setReportOpen(false)}
        />
      )}
    </div>
  )
}
