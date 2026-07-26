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
          <strong>Live now</strong> — UK BMW 1–4 Series builds (N54 / N55 / B58 /
          S55 / S58), DVLA / demo reg lookup, MOT/OPF badges, exhaust sound
          check, stage kits, product profiles, community seeds, and checkout buy
          links.
        </li>
        <li>
          <strong>In progress</strong> — tighter product photos &amp; URLs,
          richer factory option packs, more chassis paint coverage, and live
          DVLA keys in production.
        </li>
        <li>
          <strong>Soon</strong> — deeper 5 / X / M fleet coverage, better compare
          tools, and account sync beyond local storage.
        </li>
      </ul>
    </article>
  )
}
