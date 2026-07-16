import './StaticPage.css'

export function DonatePage() {
  return (
    <article className="static">
      <h1>Donate</h1>
      <p className="static__lead">
        CarPartPicker is free to use. If it helps your build, you can support
        hosting and new car data.
      </p>
      <p>
        Donation links coming soon. For now, the best support is sharing a build
        with a friend and starring the project on GitHub.
      </p>
      <p>
        <a
          className="btn btn--primary"
          href="https://github.com/leop327/carpartpicker"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </p>
    </article>
  )
}
