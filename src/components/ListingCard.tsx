import { Link } from 'react-router-dom'
import type { Listing } from '../data/listings'

export default function ListingCard({ listing: l }: { listing: Listing }) {
  return (
    <Link
      to={`/listing/${l.id}`}
      className="listing"
      style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
    >
      <div className="listing-head">
        <div className={`listing-icon ${l.iconClass}`}>{l.icon}</div>
        <div className="listing-badges">
          {l.badges.map((b, i) => (
            <span key={i} className={b.kind === 'plain' ? 'badge' : `badge ${b.kind}`}>
              {b.label}
            </span>
          ))}
        </div>
      </div>
      <div className="listing-title">{l.title}</div>
      <div className="listing-cat">{l.category}</div>
      <p className="listing-desc">{l.desc}</p>
      <div className="tech-stack">
        {l.tech.map((t) => (
          <span key={t} className="tech-tag">{t}</span>
        ))}
      </div>
      <div className="listing-metrics">
        {l.metrics.map((m, i) => (
          <div className="metric" key={i}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-val">
              {m.val}
              {m.small ? <small> {m.small}</small> : null}
              {m.trend ? <span className="metric-trend"> {m.trend}</span> : null}
            </div>
          </div>
        ))}
      </div>
      <div className="listing-footer">
        <div className="seller">
          <div className="seller-avatar">{l.seller.avatar}</div>
          <div className="seller-info">
            <div className="seller-name">{l.seller.name}</div>
            <div className="seller-rating">{l.seller.rating}</div>
          </div>
        </div>
        <div className="listing-price">
          <div className="listing-price-num">{l.price.num}</div>
          <div className="listing-price-type">{l.price.type}</div>
        </div>
      </div>
    </Link>
  )
}
