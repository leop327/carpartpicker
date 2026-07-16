import { useMemo, useState } from 'react'
import { catalog } from '../../data/catalog'
import { formatMoney } from '../../lib/build'
import { unlockMilestone } from '../../lib/milestones'
import type { Mod, ModCategoryId } from '../../types/catalog'
import './CheckoutPanel.css'

interface Props {
  modIds: string[]
  modsTotal: number
  onRemoveMod: (modId: string) => void
  onBackToMods: () => void
}

export function CheckoutPanel({
  modIds,
  modsTotal,
  onRemoveMod,
  onBackToMods,
}: Props) {
  const [bought, setBought] = useState<Set<string>>(() => new Set())

  const mods = modIds
    .map((id) => catalog.getModById(id))
    .filter((m): m is Mod => Boolean(m))

  const byCategory = useMemo(() => {
    const order = catalog.modCategories.map((c) => c.id)
    const map = new Map<ModCategoryId, Mod[]>()
    for (const mod of mods) {
      const list = map.get(mod.category) ?? []
      list.push(mod)
      map.set(mod.category, list)
    }
    return order
      .filter((id) => map.has(id))
      .map((id) => ({
        category: catalog.modCategories.find((c) => c.id === id)!,
        mods: map.get(id)!,
      }))
  }, [mods])

  const boughtCount = mods.filter((m) => bought.has(m.id)).length

  function markBought(id: string) {
    setBought((prev) => new Set(prev).add(id))
    unlockMilestone('first-checkout')
  }

  function toggleBought(id: string) {
    setBought((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="checkout">
      <div className="checkout__intro">
        <h2 className="wizard__title">Checkout</h2>
        <p>
          Shopping run — buy each part from the supplier. Tick them off as you
          go. CarPartPicker does not take payment.
        </p>
        {mods.length > 0 && (
          <div className="checkout__progress">
            <span>
              {boughtCount} of {mods.length} bought
            </span>
            <div className="checkout__progress-track" aria-hidden>
              <span
                className="checkout__progress-fill"
                style={{
                  width: `${mods.length ? (boughtCount / mods.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {mods.length === 0 ? (
        <p className="checkout__empty">
          No mods selected yet.{' '}
          <button type="button" className="checkout__text-btn" onClick={onBackToMods}>
            Back to mods
          </button>
        </p>
      ) : (
        byCategory.map(({ category, mods: group }) => (
          <section key={category.id} className="checkout__group">
            <h3>{category.name}</h3>
            <ul className="checkout__list">
              {group.map((mod) => {
                const url = catalog.resolveProductUrl(mod)
                const isBought = bought.has(mod.id)
                return (
                  <li
                    key={mod.id}
                    className={
                      isBought
                        ? 'checkout__row checkout__row--bought'
                        : 'checkout__row'
                    }
                  >
                    <div className="checkout__meta">
                      <strong>
                        {mod.brand} {mod.name}
                      </strong>
                      <span>{mod.description}</span>
                    </div>
                    <div className="checkout__actions">
                      <span className="checkout__price">
                        {formatMoney(mod.price)}
                      </span>
                      <a
                        className="btn btn--primary btn--small"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => markBought(mod.id)}
                      >
                        Buy
                      </a>
                      <button
                        type="button"
                        className="checkout__tick"
                        onClick={() => toggleBought(mod.id)}
                        aria-pressed={isBought}
                      >
                        {isBought ? 'Bought' : 'Mark bought'}
                      </button>
                      <button
                        type="button"
                        className="checkout__remove"
                        onClick={() => onRemoveMod(mod.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        ))
      )}

      <div className="checkout__footer">
        <div className="checkout__total">
          <span>Mods total</span>
          <strong>{formatMoney(modsTotal)}</strong>
        </div>
        <div className="checkout__footer-actions">
          <button type="button" className="btn btn--ghost" onClick={onBackToMods}>
            Edit mods
          </button>
          {mods.length > 0 && (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                unlockMilestone('first-checkout')
                for (const mod of mods) {
                  markBought(mod.id)
                  window.open(
                    catalog.resolveProductUrl(mod),
                    '_blank',
                    'noopener,noreferrer',
                  )
                }
              }}
            >
              Open all buy links
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
