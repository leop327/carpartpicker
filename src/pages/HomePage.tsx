import { Link } from 'react-router-dom'
import './HomePage.css'

export function HomePage() {
  return (
    <div className="home">
      <section className="home__hero">
        <p className="home__brand">CarPartPicker</p>
        <h1 className="home__headline">Build it like you drive it.</h1>
        <p className="home__lede">
          Pick your exact car, lock in factory options, then stack real mods —
          and watch the numbers move.
        </p>
        <div className="home__cta">
          <Link className="btn btn--primary" to="/builds">
            Builds
          </Link>
        </div>
      </section>

      <section className="home__explain" aria-labelledby="what-you-can-do">
        <h2 id="what-you-can-do">What you can do</h2>
        <p>
          Start from a real model, year, and colour. Choose factory options or
          leave them on the base spec. Then add exhausts, intakes, tunes,
          suspension, and more — each with a street price and figure deltas.
          Compatible parts stay filtered to your car so the list stays honest.
        </p>
        <ul>
          <li>Match the car you already own (or the one you want)</li>
          <li>Optional factory packs — unpicked stays on base options</li>
          <li>Mods by category with live HP, torque, 0–60, and weight</li>
        </ul>
      </section>
    </div>
  )
}
