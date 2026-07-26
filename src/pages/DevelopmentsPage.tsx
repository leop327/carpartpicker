import './StaticPage.css'

export function DevelopmentsPage() {
  return (
    <article className="static">
      <h1>Developments</h1>
      <p className="static__lead">
        What&apos;s shipping and what&apos;s next for the UK BMW garage.
      </p>
      <ul className="static__list">
        <li>
          <strong>Live now</strong> — UK BMW builds, DVLA / demo reg lookup,
          MOT/OPF badges, stage kits, product profiles, community seeds, and
          checkout buy links.
        </li>
        <li>
          <strong>In progress</strong> — tighter product photos &amp; URLs,
          richer factory option packs, more paint coverage, and live DVLA keys
          in production.
        </li>
        <li>
          <strong>Soon</strong> — broader chassis coverage, better compare
          tools, and account sync beyond local storage.
        </li>
      </ul>
    </article>
  )
}
