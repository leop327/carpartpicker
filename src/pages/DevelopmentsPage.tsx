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
          maintenance log, notes, CBLP styling, checkout buy links, and mod
          export.
        </li>
        <li>
          <strong>In progress</strong> — more chassis coverage, tighter product
          URLs, and richer factory option packs.
        </li>
        <li>
          <strong>Soon</strong> — community share links, more markets, and
          better compare tools.
        </li>
      </ul>
    </article>
  )
}
