import './StaticPage.css'

export function AboutPage() {
  return (
    <article className="static">
      <h1>About</h1>
      <p className="static__lead">
        CarPartPicker helps you configure a BMW, stack realistic mods, and see
        how the figures move — without guessing.
      </p>
      <p>
        Totals are mods-only (UK £). Factory options change the car&apos;s
        configured figures; aftermarket parts drive the checkout shopping list.
      </p>
      <p>
        Figures are labelled by source (OEM / tuner / estimated). Always verify
        fitment and legality for your car and country.
      </p>
    </article>
  )
}
