import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatMoney } from '../lib/build'
import {
  getVendorBySlug,
  listListings,
  recordVendorClick,
  recordVendorImpression,
} from '../lib/vendors'
import './VendorsPage.css'

export function VendorDetailPage() {
  const { slug = '' } = useParams()
  const vendor = useMemo(() => getVendorBySlug(slug), [slug])
  const listings = useMemo(
    () => (vendor ? listListings(vendor.id).filter((l) => l.active) : []),
    [vendor],
  )

  useEffect(() => {
    if (vendor) recordVendorImpression(vendor.id)
  }, [vendor])

  if (!vendor) {
    return (
      <div className="vendors">
        <h1>Vendor not found</h1>
        <Link to="/vendors">Back to vendors</Link>
      </div>
    )
  }

  return (
    <div className="vendors">
      <header className="vendors__head">
        <p className="hud-label">Company</p>
        <h1>{vendor.name}</h1>
        <p>{vendor.about}</p>
        <p className="vendors__meta">
          Regions: {vendor.regions.join(', ')}
          {vendor.retainerStatus !== 'none'
            ? ` · Retainer: ${vendor.retainerStatus}${vendor.retainerTier ? ` (${vendor.retainerTier})` : ''}`
            : ''}
        </p>
        {vendor.website && (
          <a
            href={vendor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--ghost"
            onClick={() => recordVendorClick(vendor.id)}
          >
            Visit website
          </a>
        )}
      </header>

      <section>
        <h2>Listings</h2>
        {listings.length === 0 ? (
          <p>No active SKUs yet.</p>
        ) : (
          <ul className="vendors__listings">
            {listings.map((l) => (
              <li key={l.id}>
                <div>
                  <strong>
                    {l.brand} {l.name}
                  </strong>
                  <p>{l.description}</p>
                  <span className="vendors__meta">
                    Fitment: {l.compatibleTags.join(', ') || '—'}
                  </span>
                </div>
                <div className="vendors__listing-side">
                  <span>{formatMoney(l.price)}</span>
                  <a
                    className="btn btn--primary btn--small"
                    href={l.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => recordVendorClick(vendor.id)}
                  >
                    Buy
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
