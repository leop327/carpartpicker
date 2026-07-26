import './StaticPage.css'

export function DevelopmentsPage() {
  return (
    <article className="static">
      <h1>Developments</h1>
      <p className="static__lead">
        What&apos;s shipping and what&apos;s next for CarPartPicker.
      </p>
      <ul className="static__list">
        <li>
          <strong>Live now</strong> — UK BMW builds, owned cars with reg +
          maintenance log, notes, CBLP styling, checkout buy links, mod export,
          homepage reg lookup (DVLA / demo), and brand platform pages (
          <code>/cars/bmw</code>).
        </li>
        <li>
          <strong>In progress</strong> — more chassis coverage, tighter product
          URLs, richer factory option packs, and live DVLA keys in production.
        </li>
        <li>
          <strong>Soon</strong> — Audi / VW / AMG / Porsche platforms, community
          share links, more markets, and better compare tools.
        </li>
      </ul>
    </article>
  )
}
