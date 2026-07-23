import { Link } from 'react-router-dom'
import { listVendors } from '../lib/vendors'
import './StaticPage.css'
import './VendorsPage.css'

export function VendorsPage() {
  const vendors = listVendors()

  return (
    <div className="vendors">
      <header className="vendors__head">
        <h1>Vendors</h1>
        <p>
          Company profiles and self-serve listings. Retainers are demo-mode until
          Stripe goes live.
        </p>
        <Link to="/vendor/dashboard" className="btn btn--primary">
          Vendor dashboard
        </Link>
      </header>
      <ul className="vendors__list">
        {vendors.map((v) => (
          <li key={v.id}>
            <Link to={`/vendors/${v.slug}`} className="vendors__card">
              <strong>{v.name}</strong>
              <span>{v.about}</span>
              <span className="vendors__meta">
                {v.regions.join(' · ')}
                {v.retainerTier ? ` · ${v.retainerTier}` : ''}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
