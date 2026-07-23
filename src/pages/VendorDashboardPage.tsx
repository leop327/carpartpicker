import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { formatMoney } from '../lib/build'
import { affiliateClickStats } from '../lib/affiliates'
import {
  RETAINER_TIERS,
  deleteListing,
  getVendorStats,
  listListings,
  listVendors,
  saveListing,
  startRetainerDemo,
  type VendorCompany,
} from '../lib/vendors'
import './VendorsPage.css'

export function VendorDashboardPage() {
  const [vendors, setVendors] = useState(() => listVendors())
  const [vendorId, setVendorId] = useState(() => vendors[0]?.id ?? '')
  const vendor = vendors.find((v) => v.id === vendorId) ?? vendors[0]
  const [listings, setListings] = useState(() =>
    vendor ? listListings(vendor.id) : [],
  )
  const stats = useMemo(
    () => (vendor ? getVendorStats(vendor.id) : null),
    [vendor, listings],
  )
  const affiliateStats = useMemo(() => affiliateClickStats(), [listings])

  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [price, setPrice] = useState('')
  const [url, setUrl] = useState('')
  const [tags, setTags] = useState('')
  const [description, setDescription] = useState('')

  function refresh(nextVendor?: VendorCompany) {
    const all = listVendors()
    setVendors(all)
    const v = nextVendor ?? all.find((x) => x.id === vendorId) ?? all[0]
    if (v) {
      setVendorId(v.id)
      setListings(listListings(v.id))
    }
  }

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!vendor) return
    saveListing({
      id: crypto.randomUUID(),
      vendorId: vendor.id,
      name: name.trim(),
      brand: brand.trim(),
      price: Number(price) || 0,
      currency: 'GBP',
      productUrl: url.trim() || 'https://example.com',
      compatibleTags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      description: description.trim(),
      active: true,
    })
    setName('')
    setBrand('')
    setPrice('')
    setUrl('')
    setTags('')
    setDescription('')
    refresh()
  }

  return (
    <div className="vendors vendors--dash">
      <header className="vendors__head">
        <h1>Vendor dashboard</h1>
        <p>
          Self-serve listings and retainer demo. Stripe checkout hooks in later —
          this stores status locally.
        </p>
        <Link to="/vendors" className="btn btn--ghost">
          Browse company profiles
        </Link>
      </header>

      {vendor && (
        <>
          <label className="vendors__select">
            Company
            <select
              value={vendor.id}
              onChange={(e) => {
                setVendorId(e.target.value)
                setListings(listListings(e.target.value))
              }}
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </label>

          {stats && (
            <div className="vendors__stats">
              <div>
                <strong>{stats.impressions}</strong>
                <span>Impressions</span>
              </div>
              <div>
                <strong>{stats.clicks}</strong>
                <span>Clicks</span>
              </div>
              <div>
                <strong>{stats.addToBuild}</strong>
                <span>Add to build</span>
              </div>
              <div>
                <strong>{stats.conversions}</strong>
                <span>Conversions</span>
              </div>
              <div>
                <strong>{affiliateStats.total}</strong>
                <span>Site affiliate clicks</span>
              </div>
            </div>
          )}

          <section className="vendors__retainers">
            <h2>Monthly retainer</h2>
            <p>
              Current:{' '}
              <strong>
                {vendor.retainerStatus}
                {vendor.retainerTier ? ` · ${vendor.retainerTier}` : ''}
              </strong>
            </p>
            <ul>
              {RETAINER_TIERS.map((tier) => (
                <li key={tier.id}>
                  <div>
                    <strong>
                      {tier.name} · {formatMoney(tier.priceMonthly)}/mo
                    </strong>
                    <span>{tier.perks.join(' · ')}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn--primary btn--small"
                    onClick={() => {
                      const next = startRetainerDemo(vendor.id, tier.id)
                      if (next) refresh(next)
                    }}
                  >
                    Activate (demo)
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Your listings</h2>
            <ul className="vendors__listings">
              {listings.map((l) => (
                <li key={l.id}>
                  <div>
                    <strong>
                      {l.brand} {l.name}
                    </strong>
                    <span className="vendors__meta">
                      {formatMoney(l.price)} · {l.compatibleTags.join(', ')}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn--ghost btn--small"
                    onClick={() => {
                      deleteListing(l.id)
                      refresh()
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <form className="vendors__form" onSubmit={handleAdd}>
              <h3>Add listing</h3>
              <label>
                Name
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label>
                Brand
                <input value={brand} onChange={(e) => setBrand(e.target.value)} required />
              </label>
              <label>
                Price (£)
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </label>
              <label>
                Product URL
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://"
                />
              </label>
              <label>
                Fitment tags (comma-separated)
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="n55, f87-m2"
                />
              </label>
              <label>
                Description
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </label>
              <button type="submit" className="btn btn--primary">
                Save listing
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  )
}
