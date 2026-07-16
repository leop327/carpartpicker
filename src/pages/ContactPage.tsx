import './StaticPage.css'

export function ContactPage() {
  return (
    <article className="static">
      <h1>Contact</h1>
      <p className="static__lead">
        Questions, corrections, or parts you want added? Reach out.
      </p>
      <ul className="static__list">
        <li>
          GitHub issues:{' '}
          <a
            href="https://github.com/leop327/carpartpicker/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            leop327/carpartpicker
          </a>
        </li>
        <li>
          Email:{' '}
          <a href="mailto:hello@carpartpicker.app">hello@carpartpicker.app</a>
        </li>
      </ul>
    </article>
  )
}
